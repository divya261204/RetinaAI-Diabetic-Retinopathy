import os
import numpy as np
import pandas as pd
import tensorflow as tf

from PIL import Image

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
    ModelCheckpoint
)

# ============================================================
# PATHS
# ============================================================

CSV_PATH = r"dataset\train.csv"
IMAGE_DIR = r"dataset\train_images"
MODEL_OUTPUT = r"experiments\mobilenetv2.keras"

# ============================================================
# SETTINGS
# ============================================================

IMAGE_SIZE = (224, 224)
NUM_CLASSES = 5
BATCH_SIZE = 32
EPOCHS = 25
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
# STRATIFIED SPLIT
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
# LOAD IMAGES
# ============================================================

def load_images(image_paths, labels):

    images = []

    for image_path in image_paths:

        image = Image.open(
            image_path
        ).convert("RGB")

        image = image.resize(
            IMAGE_SIZE
        )

        image = np.array(
            image,
            dtype=np.float32
        )

        images.append(image)

    images = np.array(
        images,
        dtype=np.float32
    )

    labels = np.array(
        labels,
        dtype=np.int32
    )

    return images, labels


print("\nLoading training images...")

X_train_images, y_train = load_images(
    X_train,
    y_train
)

print("Loading validation images...")

X_validation_images, y_validation = load_images(
    X_validation,
    y_validation
)

print("Loading test images...")

X_test_images, y_test = load_images(
    X_test,
    y_test
)

print(
    "\nTraining shape:",
    X_train_images.shape
)

print(
    "Validation shape:",
    X_validation_images.shape
)

print(
    "Test shape:",
    X_test_images.shape
)

# ============================================================
# MOBILENETV2 PREPROCESSING
# ============================================================

print("\nApplying MobileNetV2 preprocessing...")

X_train_images = preprocess_input(
    X_train_images
)

X_validation_images = preprocess_input(
    X_validation_images
)

X_test_images = preprocess_input(
    X_test_images
)

# ============================================================
# CLASS WEIGHTS
# ============================================================

print("\nCalculating class weights...")

classes = np.unique(y_train)

class_weights_array = compute_class_weight(
    class_weight="balanced",
    classes=classes,
    y=y_train
)

class_weights = {
    int(class_id): float(weight)
    for class_id, weight
    in zip(classes, class_weights_array)
}

print("\nClass weights:")

for class_id, weight in class_weights.items():

    print(
        f"{class_id} "
        f"{CLASS_NAMES[class_id]}: "
        f"{weight:.4f}"
    )

# ============================================================
# DATA AUGMENTATION
# ============================================================

data_augmentation = tf.keras.Sequential([

    layers.RandomFlip(
        "horizontal"
    ),

    layers.RandomRotation(
        0.08
    ),

    layers.RandomZoom(
        0.10
    ),

    layers.RandomContrast(
        0.10
    )

], name="data_augmentation")

# ============================================================
# BASE MODEL
# ============================================================

print("\nCreating MobileNetV2...")

base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze base model initially

base_model.trainable = False

# ============================================================
# BUILD MODEL
# ============================================================

inputs = layers.Input(
    shape=(224, 224, 3)
)

x = data_augmentation(
    inputs
)

x = base_model(
    x,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(
    0.35
)(x)

x = layers.Dense(
    128,
    activation="relu"
)(x)

x = layers.Dropout(
    0.30
)(x)

outputs = layers.Dense(
    NUM_CLASSES,
    activation="softmax"
)(x)

model = models.Model(
    inputs,
    outputs
)

# ============================================================
# COMPILE
# ============================================================

model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)

print("\nModel summary:")

model.summary()

# ============================================================
# CALLBACKS
# ============================================================

callbacks = [

    EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1
    ),

    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-6,
        verbose=1
    ),

    ModelCheckpoint(
        MODEL_OUTPUT,
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )
]

# ============================================================
# TRAIN
# ============================================================

print("\n==========================================")
print("STARTING MOBILENETV2 TRAINING")
print("==========================================")

history = model.fit(

    X_train_images,
    y_train,

    validation_data=(
        X_validation_images,
        y_validation
    ),

    epochs=EPOCHS,

    batch_size=BATCH_SIZE,

    class_weight=class_weights,

    callbacks=callbacks,

    verbose=1
)

# ============================================================
# EVALUATE
# ============================================================

print("\n==========================================")
print("MOBILENETV2 TEST EVALUATION")
print("==========================================")

test_loss, test_accuracy = model.evaluate(

    X_test_images,
    y_test,

    verbose=1
)

print(
    f"\nTest Loss: {test_loss:.4f}"
)

print(
    f"Test Accuracy: "
    f"{test_accuracy * 100:.2f}%"
)

# ============================================================
# SAVE HISTORY
# ============================================================

history_df = pd.DataFrame(
    history.history
)

history_df.to_csv(
    r"experiments\mobilenetv2_training_history.csv",
    index=False
)

# ============================================================
# SAVE FINAL MODEL
# ============================================================

model.save(
    MODEL_OUTPUT
)

print("\n==========================================")
print("MOBILENETV2 TRAINING COMPLETED")
print("==========================================")

print(
    f"Model saved to: "
    f"{MODEL_OUTPUT}"
)

print(
    "History saved to: "
    "experiments\\mobilenetv2_training_history.csv"
)