import argparse
import torch
import nibabel as nib
import numpy as np
from model.network import Network  # Correct class name

# ----------------- ARGUMENT PARSER -----------------
parser = argparse.ArgumentParser(description="Predict Alzheimer's from MRI")
parser.add_argument("--mri", type=str, required=True, help="Path to MRI NIfTI file (.nii or .nii.gz)")
parser.add_argument("--model", type=str, required=True, help="Path to trained model (.pth)")
parser.add_argument("--device", type=str, default="cpu", help="cpu or cuda")
args = parser.parse_args()

# ----------------- DEVICE -----------------
device = torch.device(args.device if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# ----------------- MODEL -----------------
input_channels = 1
input_shape = (200, 200, 150)  # From training
output_size = 2  # Binary classification

model = Network(input_channels, input_shape, output_size).to(device)
model.load_state_dict(torch.load(args.model, map_location=device))
model.eval()

# ----------------- LOAD & PREPROCESS MRI -----------------
print(f"Loading MRI: {args.mri}")
mri_img = nib.load(args.mri)
mri_data = mri_img.get_fdata()

# Normalize intensity values
mri_data = (mri_data - np.min(mri_data)) / (np.max(mri_data) - np.min(mri_data))

# Resize or crop to match (200, 200, 150)
if mri_data.shape != input_shape:
    print(f"WARNING MRI shape {mri_data.shape} does not match {input_shape}. Resizing...")
    from skimage.transform import resize
    mri_data = resize(mri_data, input_shape, anti_aliasing=True)

# Convert to tensor
mri_tensor = torch.tensor(mri_data, dtype=torch.float32).unsqueeze(0).unsqueeze(0)  # Shape: (1, 1, 200, 200, 150)
mri_tensor = mri_tensor.to(device)

# ----------------- PREDICTION -----------------
with torch.no_grad():
    output = model(mri_tensor)
    predicted_class = torch.argmax(output).item()
    probabilities = torch.softmax(output, dim=0).cpu().numpy()

# ----------------- RESULTS -----------------
classes = ["No Alzheimer's", "Alzheimer's Detected"]
print("\nPrediction Results:")
print(f"Predicted Class: {classes[predicted_class]}")
print(f"Class Probabilities: {probabilities}")
