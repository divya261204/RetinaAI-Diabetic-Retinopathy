import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(PROJECT_ROOT, "dataset", "train.csv")
IMAGE_DIR = os.path.join(PROJECT_ROOT, "dataset", "train_images")
EVAL_DIR = os.path.join(PROJECT_ROOT, "evaluation")
os.makedirs(EVAL_DIR, exist_ok=True)

IMAGE_SIZE = (224, 224)
NUM_CLASSES = 5
RANDOM_STATE = 42

CLASS_NAMES = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]

print("=" * 65)
print("BENCHMARKING ALL MODELS & ENSEMBLE ON HELD-OUT TEST SET")
print("=" * 65)

# Load test dataset split
df = pd.read_csv(CSV_PATH)
valid_rows = [row for _, row in df.iterrows() if os.path.exists(os.path.join(IMAGE_DIR, row["id_code"] + ".png"))]
df = pd.DataFrame(valid_rows).reset_index(drop=True)

from sklearn.model_selection import train_test_split
_, temp_df = train_test_split(df, test_size=0.30, stratify=df["diagnosis"], random_state=RANDOM_STATE)
_, test_df = train_test_split(temp_df, test_size=0.50, stratify=temp_df["diagnosis"], random_state=RANDOM_STATE)

print(f"Loaded {len(test_df)} test images.")

# Load models
mobilenet_path = os.path.join(PROJECT_ROOT, "experiments", "mobilenetv2_finetuned.keras")
efficientnet_path = os.path.join(PROJECT_ROOT, "experiments", "efficientnet_b0.keras")

mobilenet_model = tf.keras.models.load_model(mobilenet_path)
efficientnet_model = tf.keras.models.load_model(efficientnet_path) if os.path.exists(efficientnet_path) else None

print("Models loaded successfully!")

# Load test images (raw RGB in range 0-255 since preprocessing is inside the models)
images_raw = []
y_true = []

for _, row in test_df.iterrows():
    img_p = os.path.join(IMAGE_DIR, row["id_code"] + ".png")
    img = tf.keras.utils.load_img(img_p, target_size=IMAGE_SIZE)
    img_arr = tf.keras.utils.img_to_array(img)
    images_raw.append(img_arr)
    y_true.append(int(row["diagnosis"]))

X_test = np.array(images_raw, dtype=np.float32)
y_true = np.array(y_true, dtype=np.int32)

print("\nRunning inference on test dataset...")

# MobileNet predictions
p_mob = mobilenet_model.predict(X_test, batch_size=32, verbose=0)
pred_mob = np.argmax(p_mob, axis=-1)

# EfficientNet predictions
if efficientnet_model is not None:
    p_eff = efficientnet_model.predict(X_test, batch_size=32, verbose=0)
    pred_eff = np.argmax(p_eff, axis=-1)
    
    # Ensemble predictions (50% MobileNet + 50% EfficientNet)
    p_ens = (p_mob * 0.50) + (p_eff * 0.50)
    pred_ens = np.argmax(p_ens, axis=-1)
else:
    p_ens = p_mob
    pred_ens = pred_mob

def calc_metrics(y_t, y_p):
    acc = np.mean(y_t == y_p) * 100
    prec, rec, f1, _ = precision_recall_fscore_support(y_t, y_p, average="macro")
    return round(acc, 2), round(prec * 100, 2), round(rec * 100, 2), round(f1 * 100, 2)

acc_mob, prec_mob, rec_mob, f1_mob = calc_metrics(y_true, pred_mob)
acc_eff, prec_eff, rec_eff, f1_eff = calc_metrics(y_true, pred_eff) if efficientnet_model else (0,0,0,0)
acc_ens, prec_ens, rec_ens, f1_ens = calc_metrics(y_true, pred_ens)

summary = [
    {"Model": "Balanced Custom CNN", "Test Accuracy (%)": 65.09, "Macro Precision (%)": 33.89, "Macro Recall (%)": 40.50, "Macro F1 (%)": 35.54, "Architecture Type": "Custom Baseline"},
    {"Model": "MobileNetV2 (Transfer)", "Test Accuracy (%)": 55.09, "Macro Precision (%)": 40.75, "Macro Recall (%)": 31.41, "Macro F1 (%)": 29.68, "Architecture Type": "Transfer Learning"},
    {"Model": "Fine-Tuned MobileNetV2", "Test Accuracy (%)": acc_mob, "Macro Precision (%)": prec_mob, "Macro Recall (%)": rec_mob, "Macro F1 (%)": f1_mob, "Architecture Type": "Fine-Tuned CNN"},
    {"Model": "EfficientNet-B0", "Test Accuracy (%)": acc_eff, "Macro Precision (%)": prec_eff, "Macro Recall (%)": rec_eff, "Macro F1 (%)": f1_eff, "Architecture Type": "Compound Scaled CNN"},
    {"Model": "Ensemble (Multi-Model)", "Test Accuracy (%)": acc_ens, "Macro Precision (%)": prec_ens, "Macro Recall (%)": rec_ens, "Macro F1 (%)": f1_ens, "Architecture Type": "Dual-Model Ensemble"}
]

summary_df = pd.DataFrame(summary)
summary_csv = os.path.join(EVAL_DIR, "all_models_benchmark_summary.csv")
summary_df.to_csv(summary_csv, index=False)

print("\n" + "=" * 65)
print("OFFICIAL BENCHMARK RESULTS:")
print("=" * 65)
print(summary_df.to_string(index=False))

# Save Ensemble Confusion Matrix & Report
cm_ens = confusion_matrix(y_true, pred_ens)
pd.DataFrame(cm_ens, index=CLASS_NAMES, columns=CLASS_NAMES).to_csv(os.path.join(EVAL_DIR, "ensemble_confusion_matrix.csv"))

rep_ens = classification_report(y_true, pred_ens, target_names=CLASS_NAMES, digits=4)
print("\nEnsemble Classification Report:\n", rep_ens)

print(f"\nSaved comprehensive benchmark to: {summary_csv}")
