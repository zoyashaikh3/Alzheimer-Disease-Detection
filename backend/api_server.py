from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile, subprocess, json, os, uuid, sys, traceback, re
from typing import Optional

HERE = os.path.dirname(os.path.abspath(__file__))
PREDICT = os.path.join(HERE, "predict.py")
DEFAULT_MODEL = os.path.join(HERE, "alzheimers_model.pth")  # your model filename here

app = FastAPI(title="Alzheimer API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model_path: Optional[str] = Form(None),
    device: Optional[str] = Form("cpu"),
):
    mri_path = None
    try:
        # ---- save upload ----
        suffix = ".nii.gz" if file.filename.lower().endswith(".nii.gz") else ".nii"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_in:
            tmp_in.write(await file.read())
            mri_path = tmp_in.name

        # ---- resolve model ----
        model_arg = model_path or DEFAULT_MODEL
        if not os.path.isabs(model_arg):
            model_arg = os.path.join(HERE, model_arg)
        if not os.path.exists(model_arg):
            return JSONResponse(status_code=400, content={"error": f"Model not found at {model_arg}"})

        # ---- call predict.py (no unsupported args) ----
        cmd = [
            sys.executable, PREDICT,
            "--mri", mri_path,
            "--model", model_arg,
            "--device", device
        ]

        # force UTF-8 output to avoid Windows console encoding issues
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"

        proc = subprocess.run(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, timeout=600, env=env
        )

        # ---- parse stdout to structured JSON ----
        stdout = proc.stdout or ""
        stderr = proc.stderr or ""

        out = {
            "returncode": proc.returncode,
            "stdout_tail": stdout[-4000:],
            "stderr_tail": stderr[-4000:]
        }

        # Parse "Predicted Class: Alzheimer's Detected"
        m_class = re.search(r"Predicted Class:\s*(.+)", stdout)
        if m_class:
            label_raw = m_class.group(1).strip()
            label = label_raw.lower()
            if "not" in label or "no alzheimer" in label:
                out["decision"] = "ALZHEIMER_NOT_PRESENT"
            else:
                out["decision"] = "ALZHEIMER_PRESENT"
            out["predicted_label_raw"] = label_raw

        # Parse "Class Probabilities: [p0 p1]"
        m_probs = re.search(r"Class\s+Probabilities:\s*\[([^\]]+)\]", stdout)
        if m_probs:
            try:
                nums = [float(x) for x in m_probs.group(1).split()]
                out["class_probs"] = nums  # [neg, pos]
                if len(nums) >= 2:
                    out["prob_pos"] = nums[1]
            except Exception:
                pass

        # Fallback: "Probability (positive class): 0.6123"
        if "prob_pos" not in out:
            m_p = re.search(r"Probability.*?:\s*([0-9.]+)", stdout)
            if m_p:
                try:
                    out["prob_pos"] = float(m_p.group(1))
                except Exception:
                    pass

        # If failed and nothing useful parsed, return logs with 500
        if proc.returncode != 0 and ("decision" not in out and "prob_pos" not in out):
            return JSONResponse(status_code=500, content=out)

        return out

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "traceback": traceback.format_exc()[-4000:]}
        )
    finally:
        if mri_path:
            try:
                os.remove(mri_path)
            except Exception:
                pass
