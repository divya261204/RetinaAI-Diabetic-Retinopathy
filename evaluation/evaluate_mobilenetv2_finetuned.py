import os
import numpy as np
import pandas as pd
import tensorflow as tf

from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix,
    classification_report
)

# ============================================================
# CONFIGURATION
# ============================================================

CSV_PATH = r"dataset\train.csv"
IMAGE_DIR = r"dataset\train_images"
MODEL_PATH = r"experiments\mobilenetv2_finetuned.keras"

IMAGE_SIZE = (224, 224)
RANDOM_STATE = 42

LABEL_NAMES = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative"
}

# ============================================================
# HEADER
# ============================================================

print("=" * 70)
print("FINE-TUNED MOBILENETV2 EVALUATION")
print("=" * 70)

# ============================================================
# LOAD DATASET
# ============================================================

df = pd.read_csv(CSV_PATH)

valid_rows = []

for _, row in df.iterrows():

    image_path = os.path.join(
        IMAGE_DIR,
        row["id_code"] + ".png"
    )

    if os.path.exists(image_path):
        valid_rows.append({
            "image_path": image_path,
            "diagnosis": int(row["diagnosis"])
        })

df = pd.DataFrame(valid_rows)

print("\nTotal valid images:", len(df))

# ============================================================
# SAME DATA SPLIT USED DURING TRAINING
# ============================================================

train_df, temp_df = train_test_split(
    df,
    test_size=0.30,
    stratify=df["diagnosis"],
    random_state=RANDOM_STATE
)

val_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    stratify=temp_df["diagnosis"],
    random_state=RANDOM_STATE
)

print("\nDataset split:")
print("Training   :", len(train_df))
print("Validation :", len(val_df))
print("Testing    :", len(test_df))

# ============================================================
# LOAD TEST IMAGES
# ============================================================

print("\nLoading test images...")

X_test = []
y_test = []

for _, row in test_df.iterrows():

    image = Image.open(row["image_path"]).convert("RGB")

    image = image.resize(IMAGE_SIZE)

    image = np.array(image, dtype=np.float32)

    X_test.append(image)
    y_test.append(row["diagnosis"])

X_test = np.array(X_test, dtype=np.float32)
y_test = np.array(y_test, dtype=np.int32)

print("Test shape:", X_test.shape)

# ============================================================
# LOAD MODEL
# ============================================================

print("\nLoading fine-tuned MobileNetV2 model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")

# ============================================================
# PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

probabilities = model.predict(
    X_test,
    batch_size=32,
    verbose=1
)

predicted_classes = np.argmax(
    probabilities,
    axis=1
)

# ============================================================
# ACCURACY
# ============================================================

accuracy = np.mean(
    predicted_classes == y_test
)

print("\n" + "=" * 70)
print("OVERALL RESULTS")
print("=" * 70)

print(f"Test Accuracy : {accuracy * 100:.2f}%")

# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    predicted_classes,
    labels=[0, 1, 2, 3, 4]
)

print("\n" + "=" * 70)
print("CONFUSION MATRIX")
print("=" * 70)

print(cm)

cm_df = pd.DataFrame(
    cm,
    index=[
        "Actual No DR",
        "Actual Mild",
        "Actual Moderate",
        "Actual Severe",
        "Actual Proliferative"
    ],
    columns=[
        "Pred No DR",
        "Pred Mild",
        "Pred Moderate",
        "Pred Severe",
        "Pred Proliferative"
    ]
)

cm_df.to_csv(
    r"evaluation\finetuned_mobilenetv2_confusion_matrix.csv"
)

# ============================================================
# CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    y_test,
    predicted_classes,
    labels=[0, 1, 2, 3, 4],
    target_names=[
        "No DR",
        "Mild",
        "Moderate",
        "Severe",
        "Proliferative"
    ],
    zero_division=0
)

print("\n" + "=" * 70)
print("CLASSIFICATION REPORT")
print("=" * 70)

print(report)

report_dict = classification_report(
    y_test,
    predicted_classes,
    labels=[0, 1, 2, 3, 4],
    target_names=[
        "No DR",
        "Mild",
        "Moderate",
        "Severe",
        "Proliferative"
    ],
    output_dict=True,
    zero_division=0
)

report_df = pd.DataFrame(report_dict).transpose()

report_df.to_csv(
    r"evaluation\finetuned_mobilenetv2_classification_report.csv"
)

# ============================================================
# SAVE TEST PREDICTIONS
# ============================================================

prediction_df = pd.DataFrame({
    "image_path": test_df["image_path"].values,
    "actual_class": y_test,
    "predicted_class": predicted_classes,
    "actual_label": [
        LABEL_NAMES[x] for x in y_test
    ],
    "predicted_label": [
        LABEL_NAMES[x] for x in predicted_classes
    ]
})

prediction_df.to_csv(
    r"evaluation\finetuned_mobilenetv2_test_predictions.csv",
    index=False
)

# ============================================================
# CLASS-WISE PERFORMANCE
# ============================================================

print("\n" + "=" * 70)
print("CLASS-WISE RECALL")
print("=" * 70)

for class_id in range(5):

    total = np.sum(y_test == class_id)

    correct = np.sum(
        (y_test == class_id) &
        (predicted_classes == class_id)
    )

    recall = correct / total if total > 0 else 0

    print(
        f"{LABEL_NAMES[class_id]:15s} "
        f"Total: {total:3d}  "
        f"Correct: {correct:3d}  "
        f"Recall: {recall * 100:6.2f}%"
    )

# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 70)
print("EVALUATION COMPLETED")
print("=" * 70)

print("\nSaved files:")

print(
    r"evaluation\finetuned_mobilenetv2_confusion_matrix.csv"
)

print(
    r"evaluation\finetuned_mobilenetv2_classification_report.csv"
)

print(
    r"evaluation\finetuned_mobilenetv2_test_predictions.csv"
)

print("=" * 70)