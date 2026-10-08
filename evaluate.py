import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)

from train import ValidationDataGenerator


# ==============================
# SETTINGS
# ==============================

VAL_CSV = "dataset/val_split.csv"

IMAGE_FOLDER = "dataset/train_images"

MODEL_PATH = "models/diabetic_retinopathy_model.keras"

BATCH_SIZE = 16


# ==============================
# CLASS NAMES
# ==============================

class_names = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]


# ==============================
# LOAD VALIDATION DATA
# ==============================

print("Loading validation dataset...")

val_df = pd.read_csv(VAL_CSV)

print(
    "Validation images:",
    len(val_df)
)


# ==============================
# CREATE VALIDATION GENERATOR
# ==============================

validation_generator = ValidationDataGenerator(
    dataframe=val_df,
    image_folder=IMAGE_FOLDER,
    batch_size=BATCH_SIZE
)


# ==============================
# LOAD MODEL
# ==============================

print("\nLoading trained model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded successfully!")


# ==============================
# GENERATE PREDICTIONS
# ==============================

print("\nGenerating predictions...")

probabilities = model.predict(
    validation_generator
)

predicted_classes = np.argmax(
    probabilities,
    axis=1
)

actual_classes = val_df[
    "diagnosis"
].values


# ==============================
# ACCURACY
# ==============================

accuracy = accuracy_score(
    actual_classes,
    predicted_classes
)

print("\n================================")
print("VALIDATION ACCURACY")
print("================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)


# ==============================
# CLASSIFICATION REPORT
# ==============================

print("\n================================")
print("CLASSIFICATION REPORT")
print("================================")

report = classification_report(
    actual_classes,
    predicted_classes,
    target_names=class_names,
    zero_division=0
)

print(report)


# ==============================
# CONFUSION MATRIX
# ==============================

print("\n================================")
print("CONFUSION MATRIX")
print("================================")

cm = confusion_matrix(
    actual_classes,
    predicted_classes
)

print(cm)


print("\nEvaluation completed successfully!")