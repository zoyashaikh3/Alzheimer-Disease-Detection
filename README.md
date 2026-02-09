# Alzheimer MRI Prediction

🔍 Overview

The Alzheimer’s MRI Prediction System is an AI-based web application that predicts the stage of Alzheimer’s Disease using MRI brain scans.
This system integrates Deep Learning, FastAPI, and a React-based frontend for smooth interaction and accurate medical insights.

The goal of this project is to help researchers and healthcare professionals analyze MRI images efficiently and predict the likelihood of Mild Cognitive Impairment (MCI) progressing to Alzheimer’s Disease (AD).

⚙️ Tech Stack
🧩 Backend:

Python (FastAPI) — REST API framework for handling requests
PyTorch — For model loading and MRI prediction
Nibabel — To process .nii MRI files
scikit-image, matplotlib, reportlab — For image processing and PDF reporting
Uvicorn — ASGI server for running FastAPI

💻 Frontend:

React + TypeScript (in folder: synapse-speak-scan-main/)
TailwindCSS — For modern and responsive UI design
Vite — Frontend build tool
ShadCN UI components — For clean and professional interface

📁 Project Structure
Alzheimers-DL-Network-master/
│
├── app.py                     # Streamlit or app entry (if any)
├── api_server.py              # FastAPI backend server
├── predict.py                 # Prediction handling script
├── predict_utils.py           # Helper functions for predictions
├── model/
│   ├── network.py             # CNN model architecture
│   └── data_loader.py         # Data loader utilities
│
├── synapse-speak-scan-main/   # React frontend
│   ├── src/
│   │   ├── pages/             # React pages (Main, Feedback, About, etc.)
│   │   └── components/        # UI components
│   ├── package.json
│   └── vite.config.ts
│
├── data_extraction/           # Data preprocessing notebooks and CSVs
├── data_sample/               # Example MRI dataset
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation

🚀 How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/TalhaShaikh922/Alzheimer-s-MRI-Prediction-System.git
cd Alzheimer-s-MRI-Prediction-System

2️⃣ Setup Backend (FastAPI)
# Create virtual environment (optional but recommended)
python -m venv env
env\Scripts\activate   # for Windows

# Install required dependencies
pip install -r requirements.txt

# Run FastAPI backend
uvicorn api_server:app --reload


✅ The backend will start at:
👉 http://127.0.0.1:8010

3️⃣ Setup Frontend (React)
cd synapse-speak-scan-main
npm install
npm run dev


✅ The frontend will start at:
👉 http://localhost:5500
 or http://localhost:5173
 (depending on Vite config)

🧩 How It Works

Upload an MRI (.nii) file from the web interface.
The frontend sends the file to the FastAPI backend via REST API.
The model processes the MRI and predicts the brain condition:
MCI to AD (progressing to Alzheimer’s)
MCI to MCI (stable mild cognitive impairment)
The result is displayed on the web dashboard.

📊 Example Output
MRI Input	Predicted Output	Confidence
Brain Scan #1	MCI → AD	92.5%
Brain Scan #2	MCI → MCI	87.3%
📦 Requirements

All dependencies are listed in requirements.txt.
You can install them using:

pip install -r requirements.txt

🧑‍💻 Contributors

👤 Shaikh Mohd Talha
📍 Project: Alzheimer’s MRI Prediction System

🛠️ Future Improvements

Deploy the model on cloud (Render / Hugging Face Spaces / AWS)
Add patient report download (PDF summary)
Integrate real-time MRI visualization
Enhance model accuracy with larger datasets

📜 License
This project is open-source and available under the MIT License.
Feel free to use, modify, and share.
