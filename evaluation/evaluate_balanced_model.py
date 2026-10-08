import os
import numpy as np
import pandas as pd
import tensorflow as tf

from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)

# ============================================================
# PATHS
# ============================================================

CSV_PATH = r"dataset\train.csv"
IMAGE_DIR = r"dataset\train_images"
MODEL_PATH = r"experiments\balanced_cnn.keras"

# ============================================================
# SETTINGS
# ============================================================

IMAGE_SIZE = (224, 224)
RANDOM_STATE = 42

CLASS_NAMES = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]

# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading dataset...")

df = pd.read_csv(CSV_PATH)

image_paths = []
labels = []

for _, row in df.iterrows():

    image_id = str(row["id_code"])
    diagnosis = int(row["diagnosis"])

    image_path = os.path.join(
        IMAGE_DIR,
        image_id + ".png"
    )

    if os.path.exists(image_path):
        image_paths.append(image_path)
        labels.append(diagnosis)

print(f"Total valid images: {len(image_paths)}")

# ============================================================
# CREATE SAME STRATIFIED SPLIT
# ============================================================

X_train, X_temp, y_train, y_temp = train_test_split(
    image_paths,
    labels,
    test_size=0.30,
    stratify=labels,
    random_state=RANDOM_STATE
)

X_validation, X_test, y_validation, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    stratify=y_temp,
    random_state=RANDOM_STATE
)

print(f"Training images:   {len(X_train)}")
print(f"Validation images: {len(X_validation)}")
print(f"Test images:       {len(X_test)}")

# ============================================================
# LOAD TEST IMAGES
# ============================================================

print("\nLoading test images...")

X_test_images = []

for image_path in X_test:

    image = Image.open(image_path).convert("RGB")
    image = image.resize(IMAGE_SIZE)

    image = np.array(image, dtype=np.float32) / 255.0

    X_test_images.append(image)

X_test_images = np.array(X_test_images, dtype=np.float32)
y_test = np.array(y_test, dtype=np.int32)

print("Test image shape:", X_test_images.shape)
print("Test labels shape:", y_test.shape)

# ============================================================
# LOAD BEST BALANCED MODEL
# ============================================================

print("\nLoading balanced CNN model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")

# ============================================================
# TEST EVALUATION
# ============================================================

print("\nEvaluating model on unseen test data...")

test_loss, test_accuracy = model.evaluate(
    X_test_images,
    y_test,
    verbose=1
)

print("\n==========================================")
print("BALANCED CNN TEST RESULTS")
print("==========================================")

print(f"Test Loss     : {test_loss:.4f}")
print(f"Test Accuracy : {test_accuracy:.4f}")
print(f"Test Accuracy : {test_accuracy * 100:.2f}%")

# ============================================================
# PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

probabilities = model.predict(
    X_test_images,
    verbose=1
)

y_pred = np.argmax(
    probabilities,
    axis=1
)

# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    y_pred,
    labels=[0, 1, 2, 3, 4]
)

print("\n==========================================")
print("CONFUSION MATRIX")
print("==========================================")

print(cm)

# ============================================================
# CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    y_test,
    y_pred,
    labels=[0, 1, 2, 3, 4],
    target_names=CLASS_NAMES,
    digits=4,
    zero_division=0
)

print("\n==========================================")
print("CLASSIFICATION REPORT")
print("==========================================")

print(report)

# ============================================================
# SAVE CONFUSION MATRIX
# ============================================================

cm_df = pd.DataFrame(
    cm,
    index=CLASS_NAMES,
    columns=CLASS_NAMES
)

cm_df.to_csv(
    r"evaluation\balanced_confusion_matrix.csv"
)

# ============================================================
# SAVE CLASSIFICATION REPORT
# ============================================================

report_dict = classification_report(
    y_test,
    y_pred,
    labels=[0, 1, 2, 3, 4],
    target_names=CLASS_NAMES,
    output_dict=True,
    zero_division=0
)

report_df = pd.DataFrame(report_dict).transpose()

report_df.to_csv(
    r"evaluation\balanced_classification_report.csv"
)

# ============================================================
# SAVE TEST PREDICTIONS
# ============================================================

prediction_df = pd.DataFrame({
    "image_path": X_test,
    "actual_class": y_test,
    "predicted_class": y_pred
})

prediction_df["actual_label"] = prediction_df[
    "actual_class"
].map(dict(enumerate(CLASS_NAMES)))

prediction_df["predicted_label"] = prediction_df[
    "predicted_class"
].map(dict(enumerate(CLASS_NAMES)))

prediction_df.to_csv(
    r"evaluation\balanced_test_predictions.csv",
    index=False
)

print("\nEvaluation files saved:")
print("1. evaluation\\balanced_confusion_matrix.csv")
print("2. evaluation\\balanced_classification_report.csv")
print("3. evaluation\\balanced_test_predictions.csv")

print("\nEvaluation completed successfully.")