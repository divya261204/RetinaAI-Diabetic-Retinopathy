import os
import numpy as np
import pandas as pd
import tensorflow as tf

from PIL import Image
from sklearn.model_selection import train_test_split


CSV_PATH = "dataset/train.csv"
IMAGE_DIR = "dataset/train_images"
MODEL_PATH = "experiments/mobilenetv2_finetuned.keras"


print("=" * 60)
print("VERIFYING SAVED MOBILENETV2 MODEL")
print("=" * 60)


# ------------------------------------------------------------
# LOAD DATASET
# ------------------------------------------------------------

df = pd.read_csv(CSV_PATH)

train_df, temp_df = train_test_split(
    df,
    test_size=0.30,
    stratify=df["diagnosis"],
    random_state=42
)

val_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    stratify=temp_df["diagnosis"],
    random_state=42
)

print("Test samples:", len(test_df))


# ------------------------------------------------------------
# LOAD MODEL
# ------------------------------------------------------------

print("\nLoading model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded.")


# ------------------------------------------------------------
# LOAD TEST IMAGES
# ------------------------------------------------------------

images = []
labels = []

print("\nLoading test images...")

for _, row in test_df.iterrows():

    image_path = os.path.join(
        IMAGE_DIR,
        str(row["id_code"]) + ".png"
    )

    image = Image.open(
        image_path
    ).convert("RGB")

    image = image.resize(
        (224, 224)
    )

    image = np.array(
        image,
        dtype=np.float32
    )

    images.append(image)

    labels.append(
        int(row["diagnosis"])
    )


X_test = np.array(
    images,
    dtype=np.float32
)

y_test = np.array(
    labels,
    dtype=np.int32
)


print("X_test shape:", X_test.shape)
print("y_test shape:", y_test.shape)


# ------------------------------------------------------------
# PREDICT
# ------------------------------------------------------------

print("\nRunning predictions...")

predictions = model.predict(
    X_test,
    batch_size=32,
    verbose=1
)

predicted_classes = np.argmax(
    predictions,
    axis=1
)


# ------------------------------------------------------------
# ACCURACY
# ------------------------------------------------------------

accuracy = np.mean(
    predicted_classes == y_test
) * 100


print("\n" + "=" * 60)
print("RESULT")
print("=" * 60)

print(
    f"Direct test accuracy: {accuracy:.2f}%"
)

print(
    "Correct predictions:",
    np.sum(predicted_classes == y_test)
)

print(
    "Total predictions:",
    len(y_test)
)

print(
    "Prediction counts:",
    np.bincount(
        predicted_classes,
        minlength=5
    )
)

print(
    "True class counts:",
    np.bincount(
        y_test,
        minlength=5
    )
)

print("=" * 60)