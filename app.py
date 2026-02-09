# app.py — FINAL (Triple-zone decision + optional calibration + PDF)

import os
import math
import streamlit as st
import torch
import nibabel as nib
import numpy as np
from model.network import Network
from skimage.transform import resize
import matplotlib.pyplot as plt
import tempfile
import datetime
import time
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader

# ----------------- PAGE CONFIG -----------------
st.set_page_config(page_title="🧠 Alzheimer's Detection", layout="centered")
st.title("🧠 Alzheimer's MRI Prediction System")
st.write("Upload your MRI scan (.nii or .nii.gz) and enter patient details to get AI-powered prediction results.")

# ----------------- MODEL PARAMETERS -----------------
input_channels = 1
input_shape = (200, 200, 150)
output_size = 2
CLASSES = ["No Alzheimer's", "Alzheimer's Detected"]

# ----------------- CALIBRATION HELPERS (optional) -----------------
def apply_temperature_to_prob(prob_pos: float, T: float) -> float:
    """Temperature scaling on binary probability (fallback when logits are not available).
    T=1.0 no change; T<1.0 sharpens; T>1.0 smooths. Use a T learned on validation for honesty."""
    eps = 1e-8
    p = max(min(float(prob_pos), 1 - eps), eps)
    logit = math.log(p / (1.0 - p))
    logit_T = logit / max(T, eps)
    pT = 1.0 / (1.0 + math.exp(-logit_T))
    return pT

def confidence_bucket(p: float) -> str:
    if p >= 0.85: return "High"
    if p >= 0.70: return "Medium"
    return "Low"

# ----------------- LOAD MODEL -----------------
@st.cache_resource
def load_model():
    model = Network(input_channels, input_shape, output_size)
    model.load_state_dict(torch.load("alzheimers_model.pth", map_location="cpu"))
    model.eval()
    return model

model = load_model()

# ----------------- PDF BUILDER -----------------
def build_pdf_bytes(patient_info, mri_filename, model_name, predicted_label, probs_or_none, chart_png_buf, conf_text=None):
    buffer = BytesIO()
    PAGE_WIDTH, PAGE_HEIGHT = A4
    margin_x = 50
    y = PAGE_HEIGHT - 60

    c = canvas.Canvas(buffer, pagesize=A4)

    # ---------- HEADER ----------
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(PAGE_WIDTH/2, y, "🧠 Alzheimer's Detection MRI Report")
    y -= 25
    c.setFont("Helvetica", 10)
    c.drawCentredString(PAGE_WIDTH/2, y, f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    y -= 20

    # Blue line
    c.setStrokeColorRGB(0/255, 102/255, 204/255)
    c.setLineWidth(2)
    c.line(margin_x, y, PAGE_WIDTH - margin_x, y)
    y -= 30

    # ---------- PATIENT INFO ----------
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_x, y, "Patient Information")
    y -= 18
    c.setFont("Helvetica", 10)
    info_lines = [
        f"Name: {patient_info['name']}",
        f"Patient ID: {patient_info['id']}",
        f"Age: {patient_info['age']}",
        f"Contact: {patient_info['contact']}",
        f"Report Date: {patient_info['date']}"
    ]
    for line in info_lines:
        c.drawString(margin_x+10, y, line)
        y -= 14
    if patient_info.get("notes"):
        c.drawString(margin_x+10, y, f"Notes: {patient_info['notes']}")
        y -= 20

    # Blue line
    c.setStrokeColorRGB(0/255, 102/255, 204/255)
    c.line(margin_x, y, PAGE_WIDTH - margin_x, y)
    y -= 30

    # ---------- PREDICTION RESULT ----------
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_x, y, "Prediction Result")
    y -= 25

    result_text = predicted_label
    confidence_text = conf_text if conf_text is not None else "N/A"

    if "Alzheimer" in predicted_label and "No" not in predicted_label and "Inconclusive" not in predicted_label:
        c.setFillColorRGB(0.9, 0.2, 0.2)  # red
    elif "No Alzheimer" in predicted_label:
        c.setFillColorRGB(0.2, 0.7, 0.2)  # green
    else:
        c.setFillColorRGB(0.5, 0.5, 0.5)  # gray for inconclusive

    c.rect(margin_x, y-10, PAGE_WIDTH - 2*margin_x, 25, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(PAGE_WIDTH/2, y+2, f"{result_text}  — Confidence: {confidence_text}")
    y -= 50

    # Extra details
    c.setFillColorRGB(0,0,0)
    c.setFont("Helvetica", 10)
    c.drawString(margin_x+10, y, f"MRI File: {mri_filename}")
    y -= 15
    c.drawString(margin_x+10, y, f"Model Used: {model_name}")
    y -= 25

    # Blue line
    c.setStrokeColorRGB(0/255, 102/255, 204/255)
    c.line(margin_x, y, PAGE_WIDTH - margin_x, y)
    y -= 30

    # ---------- PROBABILITY + DONUT CHART ----------
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_x, y, "Probability Distribution")
    y -= 20

    if probs_or_none is not None:
        # Left column = probability bars
        bar_x = margin_x+10
        bar_w = 200
        bar_h = 14
        text_offset = 220
        c.setFont("Helvetica", 10)

        # No Alzheimer's (green)
        c.setFillColorRGB(0.9, 1, 0.9)
        c.rect(bar_x, y, bar_w, bar_h, fill=1, stroke=0)
        c.setFillColorRGB(0.2, 0.8, 0.2)
        c.rect(bar_x, y, bar_w*probs_or_none[0], bar_h, fill=1, stroke=0)
        c.setFillColorRGB(0,0,0)
        c.drawString(bar_x+text_offset, y+2, f"No Alzheimer's: {probs_or_none[0]*100:.2f}%")
        y -= 25

        # Alzheimer's (red)
        c.setFillColorRGB(1, 0.9, 0.9)
        c.rect(bar_x, y, bar_w, bar_h, fill=1, stroke=0)
        c.setFillColorRGB(0.9, 0.2, 0.2)
        c.rect(bar_x, y, bar_w*probs_or_none[1], bar_h, fill=1, stroke=0)
        c.setFillColorRGB(0,0,0)
        c.drawString(bar_x+text_offset, y+2, f"Alzheimer's: {probs_or_none[1]*100:.2f}%")

        # Right column = donut chart
        try:
            img = ImageReader(chart_png_buf)
            img_x = PAGE_WIDTH - margin_x - 180
            img_y = PAGE_HEIGHT/2 - 80
            c.drawImage(img, img_x, img_y, width=160, height=160)
        except:
            pass
        y -= 70
    else:
        c.setFont("Helvetica", 10)
        c.drawString(margin_x+10, y, "Inconclusive case — probabilities not shown due to low confidence.")
        y -= 25

    # Blue line
    c.setStrokeColorRGB(0/255, 102/255, 204/255)
    c.line(margin_x, y, PAGE_WIDTH - margin_x, y)
    y -= 30

    # ---------- DISCLAIMER ----------
    c.setFont("Helvetica", 9)
    disclaimer = (
        "Disclaimer: This is an AI-assisted prediction report intended for research/educational purposes only. "
        "It should not be used as a definitive medical diagnosis. "
        "Please consult a qualified medical professional for clinical decisions."
    )
    text_obj = c.beginText(margin_x, y)
    text_obj.setFont("Helvetica", 9)
    for line in disclaimer.split(". "):
        text_obj.textLine(line.strip() + ('.' if not line.endswith('.') else ''))
    c.drawText(text_obj)

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer

# ----------------- PATIENT INFO FORM -----------------
st.markdown("### 🧾 Patient Information")
col1, col2 = st.columns(2)
with col1:
    patient_name = st.text_input("👤 Patient Name")
    patient_age = st.number_input("🎂 Age", min_value=1, max_value=120, step=1)
    patient_id = st.text_input("🆔 Patient ID")
with col2:
    patient_contact = st.text_input("📞 Contact Number")
    patient_date = st.date_input("📅 Date", value=datetime.date.today())
    patient_notes = st.text_area("📝 Notes")

# ----------------- FILE UPLOADER -----------------
uploaded_file = st.file_uploader("📂 Upload MRI File", type=["nii", "nii.gz"])

# ----------------- PREDICTION -----------------
if uploaded_file is not None:
    st.success(f"✅ File uploaded: {uploaded_file.name}")

    if st.button("🔍 Run Prediction"):
        try:
            with st.spinner("⏳ Processing MRI Scan... Please wait"):
                progress = st.progress(0)
                for i in range(100):
                    time.sleep(0.02)
                    progress.progress(i + 1)

            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=".nii") as tmp_file:
                tmp_file.write(uploaded_file.getbuffer())
                tmp_path = tmp_file.name

            # Load MRI file
            mri_img = nib.load(tmp_path)
            mri_data = mri_img.get_fdata()

            # Normalize & resize
            mri_min, mri_max = float(np.min(mri_data)), float(np.max(mri_data))
            mri_data = (mri_data - mri_min) / (mri_max - mri_min + 1e-8)
            if mri_data.shape != input_shape:
                st.warning(f"⚠ MRI shape {mri_data.shape} does not match {input_shape}. Resizing...")
                mri_data = resize(mri_data, input_shape, anti_aliasing=True, preserve_range=True).astype(np.float32)

            # Convert to tensor: [1,1,D,H,W]
            mri_tensor = torch.tensor(mri_data, dtype=torch.float32).unsqueeze(0).unsqueeze(0)

            # ----------------- RUN PREDICTION -----------------
            with torch.no_grad():
                output = model(mri_tensor)                # could be [2] or [1,2]
                probs_t = torch.softmax(output, dim=-1)   # robust last-dim softmax
                probs_np = probs_t.detach().cpu().numpy()
                probs = probs_np[0] if probs_np.ndim == 2 else probs_np  # shape [2,]
                predicted_class = int(np.argmax(probs))

            # --------- Optional temperature scaling (default OFF) ---------
            T = float(os.getenv("TEMP_CAL", "1.0"))  # set TEMP_CAL=0.85 (example) if you calibrate later
            prob_pos = float(probs[1])
            prob_pos_cal = apply_temperature_to_prob(prob_pos, T)
            probs = np.array([1.0 - prob_pos_cal, prob_pos_cal], dtype=float)
            predicted_class = int(np.argmax(probs))

            # ----------------- TRIPLE-ZONE DECISION -----------------
            prob_pos = float(probs[1])   # P(Alzheimer's)
            prob_neg = float(probs[0])   # P(No Alzheimer's)
            HARD_POS = 0.90
            HARD_NEG = 0.10

            if prob_pos >= HARD_POS:
                display_label = "Alzheimer's Detected"
                display_conf = f"{prob_pos*100:.0f}%"
                display_style = "high_pos"
                show_probs = True
            elif prob_pos <= HARD_NEG:
                display_label = "No Alzheimer's"
                display_conf = f"{prob_neg*100:.0f}%"
                display_style = "high_neg"
                show_probs = True
            else:
                display_label = "Inconclusive"
                display_conf = None
                display_style = "inconclusive"
                show_probs = False  # hide numeric % for inconclusive cases

            # ----------------- REPORT DISPLAY -----------------
            st.markdown("## 📋 Prediction Report")
            st.markdown(f"""
            **👤 Patient Name:** {patient_name or "N/A"}  
            **🆔 Patient ID:** {patient_id or "N/A"}  
            **🎂 Age:** {patient_age or "N/A"}  
            **📞 Contact:** {patient_contact or "N/A"}  
            **📅 Date:** {patient_date}  
            **📝 Notes:** {patient_notes or "N/A"}  
            """)

            st.info(f"**Patient MRI File:** {uploaded_file.name}")
            st.write(f"**Model Used:** `alzheimers_model.pth`")
            st.write(f"**Device:** CPU")

            # ---------- Stylish Prediction Card (triple-zone) ----------
            st.markdown("### 🧠 Model Decision")
            if display_style == "high_pos":
                st.error(f"🚨 Prediction: **{display_label}**\n\nConfidence: {display_conf}")
            elif display_style == "high_neg":
                st.success(f"✅ Prediction: **{display_label}**\n\nConfidence: {display_conf}")
            else:
                st.warning("⚠️ Prediction: **Inconclusive**\n\nConfidence not high enough to report a reliable percentage. Please consider further evaluation.")

            # For inconclusive, you may still show class names without %:
            if display_style == "inconclusive":
                st.write("**Top Classes (no % shown):**")
                st.write(f"• No Alzheimer's")
                st.write(f"• Alzheimer's Detected")

            # ----------------- PROBABILITY VISUALS -----------------
            if show_probs:
                st.markdown("### 📊 Probability Scores")
                st.progress(int(probs[0]*100))
                st.write(f"🟢 No Alzheimer's: {probs[0]*100:.2f}%")
                st.progress(int(probs[1]*100))
                st.write(f"🔴 Alzheimer's Detected: {probs[1]*100:.2f}%")

                st.markdown("### 🎯 Probability Distribution")
                fig, ax = plt.subplots()
                ax.pie(
                    probs,
                    labels=CLASSES,
                    autopct='%1.1f%%',
                    startangle=90,
                    colors=["#4ade80", "#f87171"],
                    wedgeprops={'width': 0.4}
                )
                ax.axis('equal')
                st.pyplot(fig)

                chart_buf = BytesIO()
                fig.savefig(chart_buf, format="png")
                chart_buf.seek(0)
            else:
                chart_buf = BytesIO()  # empty buffer for PDF

            # ----------------- DOWNLOAD PDF -----------------
            patient_info = {
                "name": patient_name or "N/A",
                "id": patient_id or "N/A",
                "age": patient_age or "N/A",
                "contact": patient_contact or "N/A",
                "date": patient_date,
                "notes": patient_notes or ""
            }

            # For PDF: if inconclusive, pass None for probs so PDF hides numeric bars.
            pdf_probs = probs if show_probs else None
            pdf_conf_text = display_conf if display_conf is not None else "N/A"

            pdf_buffer = build_pdf_bytes(
                patient_info,
                uploaded_file.name,
                "alzheimers_model.pth",
                display_label,
                pdf_probs,
                chart_buf,
                conf_text=pdf_conf_text
            )

            st.download_button(
                label="📥 Download Professional PDF Report",
                data=pdf_buffer,
                file_name=f"Alzheimers_Report_{patient_info['id']}.pdf",
                mime="application/pdf"
            )

        except Exception as e:
            st.error(f"❌ Error while processing file: {e}")
