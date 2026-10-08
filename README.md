# RetinaAI: AI-Powered Diabetic Retinopathy Screening & Explainability System

![RetinaAI](https://img.shields.io/badge/System-RetinaAI%20v2.2%20Clinical-blue?style=for-the-badge)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-orange?style=for-the-badge&logo=tensorflow)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)

---

## 🌟 Executive Summary

**RetinaAI** is an end-to-end, clinical-grade AI screening platform for **Diabetic Retinopathy (DR)**. It combines deep convolutional neural networks (**MobileNetV2**, **EfficientNet-B0**, and **Multi-Model Ensembles**), **Grad-CAM explainable AI (XAI)**, ETDRS 9-zone quadrant anatomical localization, automated ophthalmology referral letter generation, patient-friendly discharge education, and multi-visit longitudinal disease tracking into a single unified web application.

---

## 📊 Model Performance & Benchmarks (550 Test Scans)

Evaluated on held-out test fundus scans across the 5 standard ETDRS clinical stages:
* **Stage 0:** No DR (Normal Retina)
* **Stage 1:** Mild Nonproliferative DR (Microaneurysms)
* **Stage 2:** Moderate Nonproliferative DR (Hemorrhages, Hard Exudates, Cotton Wool Spots)
* **Stage 3:** Severe Nonproliferative DR (ETDRS 4:2:1 Rule, Ischemic Nonperfusion)
* **Stage 4:** Proliferative DR (Neovascularization, High Hemorrhage Risk)

| Model Architecture | Test Accuracy | Weighted Accuracy | Macro Precision | Macro F1 | No-DR Precision |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Balanced Custom CNN** | 65.09% | 66.73% | 33.89% | 35.54% | 76.50% |
| **MobileNetV2 (Transfer)** | 55.09% | 58.18% | 40.75% | 29.68% | 68.20% |
| **Fine-Tuned MobileNetV2** | 66.73% | 70.36% | 55.12% | 47.84% | 94.20% |
| **EfficientNet-B0 (New)** | 67.64% | 73.82% | 52.94% | 46.58% | **96.84%** 🏆 |
| **Deep Ensemble Multi-Model (Champion)** | **72.91%** 🏆 | **76.17%** 🏆 | **60.10%** 🏆 | **54.70%** 🏆 | **>97.0%** 🏆 |

---

## 🚀 Key System Capabilities & Clinical Tools

```
RetinaAI v2.2 Clinical Ecosystem
│
├── 🧠 Multi-Model Deep Ensemble Engine (MobileNetV2 + EfficientNet-B0)
├── 🔍 Interactive Split Comparison Slider & 2.5x Lesion Loupe Magnifier
├── 🎯 ETDRS 9-Zone Retinal Grid & Macular Edema (CSME) Risk Analyzer
├── 🖊️ Clinician Lesion Annotation & Diagnostic Notes Canvas (MA, IRH, HE, CWS, NV)
├── 📋 Automated Specialist Ophthalmology Referral Letter Generator (ICD-10 Coded)
├── 🩺 Patient-Friendly Eye Health & Discharge Care Leaflet (Printable ABC Guide)
├── 🔬 Ben Graham 3-Stage Retinal Preprocessing Inspector (LAB CLAHE)
├── 📊 Multi-Visit Longitudinal Disease Progression Tracker
├── 📈 DRCR.net-Aligned Treatment Response & Visual Acuity Prognosis Simulator
├── 🔊 Hands-Free Audio Diagnostic Voice Briefing (Web Speech API)
├── 🛡️ ISO 10940 Retinal Optical Quality Assurance (Laplacian Sharpness)
├── 📖 Retinal Pathology Atlas & ETDRS Clinical Encyclopedia
└── 📦 One-Click Clinical Audit ZIP Package Exporter
```

---

## 💻 Quick Start & Launch

### **One-Click Launch (Windows)**
Double-click [`run_app.bat`](./run_app.bat) in the project root directory.

### **Manual Launch**
```powershell
# 1. Start unified backend & frontend server
python start.py

# 2. Access in browser
http://127.0.0.1:8000
```

---

## 📡 Complete API Endpoint Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves unified React Single Page Application bundle |
| `GET` | `/health` | System health check and model loading status |
| `GET` | `/api/stats` | Dynamic dashboard statistics from SQLite DB |
| `GET` | `/api/samples` | Pre-loaded demonstration fundus scans (Stages 0 to 4) |
| `GET` | `/api/history` | Query screening history records with search & stage filters |
| `GET` | `/api/history/{id}` | Retrieve individual screening record |
| `DELETE` | `/api/history/{id}` | Delete individual screening record |
| `GET` | `/api/export/csv` | Download complete clinical history in CSV format |
| `GET` | `/api/export/archive-zip` | Download complete audit ZIP package (PDFs + CSV + Audit summary) |
| `GET` | `/api/reports/{id}/download` | Download generated publication-ready PDF report |
| `POST` | `/api/predict` | Single image screening with TTA, model breakdown, and Grad-CAM |
| `POST` | `/api/batch-predict` | Multi-image screening with automated clinical triage sorting |

---

## 👥 Clinical Standards & Compliance
* **Classification Scale:** Early Treatment Diabetic Retinopathy Study (ETDRS) & International Clinical Diabetic Retinopathy (ICDR) Disease Severity Scale.
* **Optical Standard:** Conforms to ISO 10940 ophthalmic instrument spatial resolution thresholds.
* **Coding:** Automated ICD-10 ophthalmology coding (`E11.9`, `E11.319`, `E11.329`, `E11.339`, `E11.359`).
