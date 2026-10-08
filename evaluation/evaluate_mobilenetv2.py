import os
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

# ============================================================
# PATHS
# ============================================================

CSV_PATH = r"dataset\train.csv"
IMAGE_DIR = r"dataset\train_images"
MODEL_PATH = r"experiments\mobilenetv2.keras"

OUTPUT_CONFUSION = r"evaluation\mobilenetv2_confusion_matrix.csv"
OUTPUT_REPORT = r"evaluation\mobilenetv2_classification_report.csv"
OUTPUT_PREDICTIONS = r"evaluation\mobilenetv2_test_predictions.csv"


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

print("=" * 60)
print("MOBILENETV2 MODEL EVALUATION")
print("=" * 60)

df = pd.read_csv(CSV_PATH)

print("\nTotal dataset images:", len(df))


# ============================================================
# CHECK IMAGE FILES
# ============================================================

valid_rows = []

for _, row in df.iterrows():

    image_path = os.path.join(
        IMAGE_DIR,
        row["id_code"] + ".png"
    )

    if os.path.exists(image_path):
        valid_rows.append(row)

df = pd.DataFrame(valid_rows).reset_index(drop=True)

print("Valid images:", len(df))


# ============================================================
# SAME TRAIN / VALIDATION / TEST SPLIT
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

X_test = []
y_test = []
test_ids = []

print("\nLoading test images...")

for _, row in test_df.iterrows():

    image_path = os.path.join(
        IMAGE_DIR,
        row["id_code"] + ".png"
    )

    image = tf.keras.utils.load_img(
        image_path,
        target_size=IMAGE_SIZE
    )

    image = tf.keras.utils.img_to_array(image)

    X_test.append(image)
    y_test.append(int(row["diagnosis"]))
    test_ids.append(row["id_code"])


X_test = np.array(X_test, dtype=np.float32)
y_test = np.array(y_test, dtype=np.int32)

print("Test image array shape:", X_test.shape)
print("Test labels shape:", y_test.shape)


# ============================================================
# LOAD MOBILENETV2 MODEL
# ============================================================

print("\nLoading MobileNetV2 model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")


# ============================================================
# PREPROCESS FOR MOBILENETV2
# ============================================================

X_test_processed = tf.keras.applications.mobilenet_v2.preprocess_input(
    X_test
)


# ============================================================
# MODEL EVALUATION
# ============================================================

print("\nEvaluating model...")

test_loss, test_accuracy = model.evaluate(
    X_test_processed,
    y_test,
    verbose=1
)

print("\n" + "=" * 60)
print("TEST RESULTS")
print("=" * 60)

print(f"Test Loss     : {test_loss:.4f}")
print(f"Test Accuracy : {test_accuracy * 100:.2f}%")


# ============================================================
# PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

probabilities = model.predict(
    X_test_processed,
    verbose=1
)

predicted_labels = np.argmax(
    probabilities,
    axis=1
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    predicted_labels,
    labels=[0, 1, 2, 3, 4]
)

print("\n" + "=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)

print(cm)


cm_df = pd.DataFrame(
    cm,
    index=CLASS_NAMES,
    columns=CLASS_NAMES
)

cm_df.to_csv(OUTPUT_CONFUSION)

print("\nSaved:")
print(OUTPUT_CONFUSION)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

report = classification_report(
    y_test,
    predicted_labels,
    labels=[0, 1, 2, 3, 4],
    target_names=CLASS_NAMES,
    output_dict=True,
    zero_division=0
)

report_df = pd.DataFrame(report).transpose()

report_df.to_csv(OUTPUT_REPORT)

print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_test,
        predicted_labels,
        labels=[0, 1, 2, 3, 4],
        target_names=CLASS_NAMES,
        zero_division=0
    )
)

print("Saved:")
print(OUTPUT_REPORT)


# ============================================================
# SAVE INDIVIDUAL PREDICTIONS
# ============================================================

prediction_rows = []

for i in range(len(test_ids)):

    prediction_rows.append({

        "id_code": test_ids[i],

        "actual_class":
            CLASS_NAMES[y_test[i]],

        "actual_label":
            int(y_test[i]),

        "predicted_class":
            CLASS_NAMES[predicted_labels[i]],

        "predicted_label":
            int(predicted_labels[i]),

        "correct":
            bool(y_test[i] == predicted_labels[i]),

        "confidence":
            float(np.max(probabilities[i])),

        "no_dr_probability":
            float(probabilities[i][0]),

        "mild_probability":
            float(probabilities[i][1]),

        "moderate_probability":
            float(probabilities[i][2]),

        "severe_probability":
            float(probabilities[i][3]),

        "proliferative_probability":
            float(probabilities[i][4])
    })


predictions_df = pd.DataFrame(
    prediction_rows
)

predictions_df.to_csv(
    OUTPUT_PREDICTIONS,
    index=False
)

print("\nSaved:")
print(OUTPUT_PREDICTIONS)


# ============================================================
# FINAL SUMMARY
# ============================================================

correct = np.sum(
    y_test == predicted_labels
)

incorrect = np.sum(
    y_test != predicted_labels
)

print("\n" + "=" * 60)
print("FINAL SUMMARY")
print("=" * 60)

print("Test images :", len(y_test))
print("Correct     :", correct)
print("Incorrect   :", incorrect)
print(f"Accuracy    : {test_accuracy * 100:.2f}%")

print("\nMobileNetV2 evaluation completed successfully.")
print("=" * 60)