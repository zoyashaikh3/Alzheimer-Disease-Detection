# predict_utils.py
import os
import torch
import torch.nn.functional as F
import numpy as np
from typing import List, Tuple, Dict
from PIL import Image
import cv2

# Grad-CAM
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

# ---------- Model loading helpers ----------
def load_model_checkpoint(model_class, checkpoint_path, device='cpu'):
    """
    model_class: callable that returns a model instance (uninitialized)
    checkpoint_path: path to .pth file
    returns loaded model on device
    """
    model = model_class()
    ckpt = torch.load(checkpoint_path, map_location=device)
    # If saved as dict with 'model_state'
    if isinstance(ckpt, dict) and 'model_state' in ckpt:
        model.load_state_dict(ckpt['model_state'])
    elif isinstance(ckpt, dict) and 'state_dict' in ckpt:
        model.load_state_dict(ckpt['state_dict'])
    else:
        try:
            model.load_state_dict(ckpt)
        except Exception:
            # try direct
            model = ckpt
    model.to(device).eval()
    return model

def load_ensemble(model_class, checkpoints: List[str], device='cpu'):
    """
    Load multiple checkpoints and return list of models.
    """
    models = []
    for ck in checkpoints:
        m = load_model_checkpoint(model_class, ck, device=device)
        models.append(m)
    return models

# ---------- Temperature scaling (post-hoc calibration) ----------
# Simple implementation: optimize temp on validation logits/labels
def find_temperature(logits: np.ndarray, labels: np.ndarray, init_temp: float = 1.0):
    """
    logits: shape (N, C) raw logits (not softmaxed)
    labels: shape (N,)
    returns temperature scalar > 0
    """
    import scipy.optimize as opt

    logits = np.array(logits, dtype=np.float64)
    labels = np.array(labels, dtype=np.int32)

    def nll(t):
        T = float(np.abs(t[0]) + 1e-6)
        scaled = logits / T
        # stable softmax
        ex = np.exp(scaled - scaled.max(axis=1, keepdims=True))
        probs = ex / ex.sum(axis=1, keepdims=True)
        # negative log-likelihood
        nllv = -np.mean(np.log(probs[np.arange(len(labels)), labels] + 1e-12))
        return nllv

    res = opt.minimize(nll, x0=[init_temp], bounds=[(1e-3, 100.0)])
    if res.success:
        temp = float(np.abs(res.x[0]) + 1e-6)
    else:
        temp = init_temp
    return temp

def apply_temperature_to_logits(logits: np.ndarray, temp: float):
    scaled = logits / float(temp)
    ex = np.exp(scaled - np.max(scaled, axis=1, keepdims=True))
    probs = ex / ex.sum(axis=1, keepdims=True)
    return probs

# ---------- Inference helpers ----------
def predict_with_models(models, input_tensor: torch.Tensor, device='cpu', return_logits=False):
    """
    models: list of model instances (or single model)
    input_tensor: torch tensor (B, C, H, W)
    returns: averaged logits (numpy array shape (B, C))
    """
    if not isinstance(models, (list, tuple)):
        models = [models]
    logits_list = []
    with torch.no_grad():
        for m in models:
            m = m.to(device)
            out = m(input_tensor.to(device))
            if isinstance(out, tuple):
                out = out[0]
            logits_list.append(out.detach().cpu().numpy())
    avg_logits = np.mean(np.stack(logits_list, axis=0), axis=0)  # average across models
    if return_logits:
        return avg_logits
    probs = apply_temperature_to_logits(avg_logits, temp=1.0)  # default temp=1.0 (no scale)
    return probs

# ---------- Subject-level aggregation ----------
def aggregate_slice_probs(slice_probs: List[np.ndarray], method='mean'):
    """
    slice_probs: list of arrays shape (C,) or shape (N_slices, C)
    method: 'mean' or 'median' or 'max'
    returns aggregated probs vector (C,)
    """
    arr = np.array(slice_probs)
    if arr.ndim == 1:
        return arr
    if method == 'mean':
        return arr.mean(axis=0)
    if method == 'median':
        return np.median(arr, axis=0)
    if method == 'max':
        return arr.max(axis=0)
    return arr.mean(axis=0)

# ---------- Decision rule (threshold + abstain) ----------
def decide_from_prob(prob_pos: float, decision_threshold: float = 0.92, calibrate_note: str = ""):
    """
    prob_pos: probability for positive class (Alzheimer present)
    decision_threshold: e.g., 0.92 (tune on val to get high precision)
    returns (label_str, reason_str)
    """
    # Use symmetric thresholds for confident negative vs positive
    high = decision_threshold
    low = 1.0 - decision_threshold
    if prob_pos >= high:
        return "ALZHEIMER_PRESENT", f"High confidence (prob={prob_pos:.3f}). {calibrate_note}"
    elif prob_pos <= low:
        return "ALZHEIMER_NOT_PRESENT", f"High confidence negative (prob={prob_pos:.3f}). {calibrate_note}"
    else:
        return "UNCERTAIN", f"Model uncertain (prob={prob_pos:.3f}). Recommend specialist review."

# ---------- Grad-CAM explanation ----------
def make_gradcam_visual(model, input_tensor: torch.Tensor, target_category: int = None, target_layer = None, device='cpu'):
    """
    model: single model (not ensemble) - grad-cam needs one model
    input_tensor: (1,C,H,W) tensor in [0,1] or normalized per model
    returns: numpy image overlay (H,W,3) uint8 for display
    """
    # choose a reasonable target_layer if not provided
    if target_layer is None:
        # try common names
        for name, module in model.named_modules():
            if name.endswith("layer4") or name.endswith("features") or name.endswith("conv5"):
                target_layer = module
                break
        if target_layer is None:
            # fallback: last conv-like module
            modules = [m for m in model.modules() if hasattr(m, 'weight') and isinstance(m.weight, torch.nn.Parameter)]
            target_layer = modules[-1]

    cam = GradCAM(model=model, target_layer=target_layer, use_cuda=(device=='cuda'))
    # If input is normalized, convert to image [0..1] for overlay: try to de-normalize if mean/std known (skip here)
    input_numpy = input_tensor.detach().cpu().numpy()[0]  # (C,H,W)
    # convert to HWC [0..1]
    img = np.transpose(input_numpy, (1,2,0))
    # if single channel repeated to 3, and values normalized around [-1,1], we rescale roughly
    # assume values in [0,1] or approx
    if img.max() > 1.1: 
        img = (img - img.min())/(img.max()-img.min()+1e-8)
    grayscale_cam = cam(input_tensor=input_tensor.to(device), targets=None)  # shape (B,H,W)
    cam_img = show_cam_on_image(img, grayscale_cam[0], use_rgb=True)
    return cam_img

# ---------- top-level predict_and_explain ----------
def predict_and_explain(models, model_for_gradcam, preproc_fn, images: List[np.ndarray],
                        device='cpu', temperature: float = 1.0, decision_threshold: float = 0.92):
    """
    models: list of models (or single)
    model_for_gradcam: single model to use for Grad-CAM (pick one model from ensemble)
    preproc_fn: function to convert a numpy image (H,W) or PIL to torch tensor (1,C,H,W) or (C,H,W)
        It should return a torch tensor ready for model input.
    images: list of numpy images (H,W) representing slices (or list of pickle paths)
    temperature: numeric (calibration), default=1.0 means no change
    decision_threshold: threshold for confident yes/no
    Returns dict with: subject_prob, decision_label, reason, gradcam_image (bytes or ndarray), per_slice_probs
    """
    device = device if torch.cuda.is_available() and device=='cuda' else 'cpu'
    slice_logits = []
    slice_probs = []
    for img in images:
        inp = preproc_fn(img)  # returns tensor (1,C,H,W) or (C,H,W)
        if inp.dim()==3:
            inp = inp.unsqueeze(0)
        # get averaged logits across models
        logits = predict_with_models(models, inp, device=device, return_logits=True)  # shape (1,C)
        logits = logits.reshape(-1, logits.shape[-1])
        slice_logits.append(logits[0])
    # average logits across slices (or average probs)
    logits_arr = np.stack(slice_logits, axis=0)  # (Nslices, C)
    # apply temperature
    probs_slices = apply_temperature_to_logits(logits_arr, temp=temperature)
    # aggregate per-subject
    agg = aggregate_slice_probs(probs_slices, method='mean')  # (C,)
    # assume binary positive is class index 1; if multi-class map accordingly
    # If multi-class >2, we can treat positive as classes 1..end; here assume binary: index 1
    if agg.shape[0] == 2:
        prob_pos = float(agg[1])
    else:
        # if multiclass: compute probability of any impairment (sum of non-zero classes)
        prob_pos = float(agg[1:].sum())  # sum of classes 1..end
    # decision
    label, reason = decide_from_prob(prob_pos, decision_threshold=decision_threshold)
    # Grad-CAM on a representative slice (choose center)
    rep_idx = len(images)//2
    rep_inp = preproc_fn(images[rep_idx])
    if rep_inp.dim()==3: rep_inp = rep_inp.unsqueeze(0)
    gradcam_img = None
    try:
        gradcam_img = make_gradcam_visual(model_for_gradcam, rep_inp, device=device)
    except Exception as e:
        gradcam_img = None
    # return results
    return {
        "subject_prob": prob_pos,
        "decision": label,
        "reason": reason,
        "per_slice_probs": probs_slices.tolist(),
        "gradcam_img": gradcam_img
    }
