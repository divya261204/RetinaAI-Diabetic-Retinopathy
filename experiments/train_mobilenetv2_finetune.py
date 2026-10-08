import os
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

from tensorflow.keras import layers, Model
from tensorflow.keras.applications import MobileNetV2


# ============================================================
# PATHS
# ============================================================

CSV_PATH = r"dataset\train.csv"
IMAGE_DIR = r"dataset\train_images"

MODEL_OUTPUT = r"experiments\mobilenetv2_finetuned.keras"
HISTORY_OUTPUT = r"experiments\mobilenetv2_finetuned_history.csv"


# ============================================================
# SETTINGS
# ============================================================

IMAGE_SIZE = (224, 224)
NUM_CLASSES = 5
BATCH_SIZE = 32
EPOCHS = 15
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

print("=" * 65)
print("MOBILENETV2 FINE-TUNING EXPERIMENT")
print("=" * 65)

df = pd.read_csv(CSV_PATH)

valid_rows = []

for _, row in df.iterrows():

    image_path = os.path.join(
        IMAGE_DIR,
        row["id_code"] + ".png"
    )

    if os.path.exists(image_path):
        valid_rows.append(row)

df = pd.DataFrame(
    valid_rows
).reset_index(drop=True)

print("\nTotal valid images:", len(df))


# ============================================================
# TRAIN / VALIDATION / TEST SPLIT
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
# LOAD IMAGES
# ============================================================

def load_images(dataframe):

    images = []
    labels = []

    for _, row in dataframe.iterrows():

        image_path = os.path.join(
            IMAGE_DIR,
            row["id_code"] + ".png"
        )

        image = tf.keras.utils.load_img(
            image_path,
            target_size=IMAGE_SIZE
        )

        image = tf.keras.utils.img_to_array(
            image
        )

        images.append(image)
        labels.append(
            int(row["diagnosis"])
        )

    return (
        np.array(images, dtype=np.float32),
        np.array(labels, dtype=np.int32)
    )


print("\nLoading training images...")

X_train, y_train = load_images(train_df)

print("Training shape:", X_train.shape)

print("\nLoading validation images...")

X_val, y_val = load_images(val_df)

print("Validation shape:", X_val.shape)

print("\nLoading test images...")

X_test, y_test = load_images(test_df)

print("Test shape:", X_test.shape)


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

])


# ============================================================
# CLASS WEIGHTS
# ============================================================

class_weights_array = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y_train),
    y=y_train
)

class_weights = {
    int(class_id): float(weight)
    for class_id, weight
    in zip(
        np.unique(y_train),
        class_weights_array
    )
}

print("\nClass weights:")

for class_id, weight in class_weights.items():

    print(
        f"{class_id} "
        f"{CLASS_NAMES[class_id]} : "
        f"{weight:.4f}"
    )


# ============================================================
# BUILD MOBILENETV2
# ============================================================

print("\nCreating MobileNetV2...")

base_model = MobileNetV2(
    input_shape=(
        IMAGE_SIZE[0],
        IMAGE_SIZE[1],
        3
    ),
    include_top=False,
    weights="imagenet"
)


# ============================================================
# FINE-TUNING
# ============================================================

# Freeze most layers
for layer in base_model.layers:
    layer.trainable = False


# Unfreeze the last 30 layers
for layer in base_model.layers[-30:]:
    layer.trainable = True


print(
    "\nTrainable layers:",
    sum(
        layer.trainable
        for layer in base_model.layers
    )
)


# ============================================================
# MODEL
# ============================================================

inputs = layers.Input(
    shape=(
        IMAGE_SIZE[0],
        IMAGE_SIZE[1],
        3
    )
)

x = data_augmentation(inputs)

x = tf.keras.applications.mobilenet_v2.preprocess_input(
    x
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


model = Model(
    inputs,
    outputs
)


# ============================================================
# COMPILE
# ============================================================

model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=1e-5
    ),

    loss="sparse_categorical_crossentropy",

    metrics=[
        "accuracy"
    ]
)


print("\nModel created.")

model.summary()


# ============================================================
# CALLBACKS
# ============================================================

callbacks = [

    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=4,
        restore_best_weights=True
    ),

    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-7
    ),

    tf.keras.callbacks.ModelCheckpoint(
        MODEL_OUTPUT,
        monitor="val_accuracy",
        save_best_only=True
    )

]


# ============================================================
# TRAIN
# ============================================================

print("\nStarting fine-tuning...")

history = model.fit(

    X_train,
    y_train,

    validation_data=(
        X_val,
        y_val
    ),

    epochs=EPOCHS,

    batch_size=BATCH_SIZE,

    class_weight=class_weights,

    callbacks=callbacks,

    verbose=1
)


# ============================================================
# SAVE HISTORY
# ============================================================

history_df = pd.DataFrame(
    history.history
)

history_df.to_csv(
    HISTORY_OUTPUT,
    index=False
)


# ============================================================
# EVALUATE
# ============================================================

print("\nEvaluating fine-tuned model...")

test_loss, test_accuracy = model.evaluate(
    X_test,
    y_test,
    verbose=1
)


print("\n" + "=" * 65)
print("FINE-TUNED MOBILENETV2 RESULTS")
print("=" * 65)

print(
    f"Test Loss     : {test_loss:.4f}"
)

print(
    f"Test Accuracy : "
    f"{test_accuracy * 100:.2f}%"
)


# ============================================================
# SAVE MODEL
# ============================================================

model.save(
    MODEL_OUTPUT
)

print("\nSaved model:")
print(MODEL_OUTPUT)

print("\nSaved history:")
print(HISTORY_OUTPUT)

print("\n" + "=" * 65)
print("FINE-TUNING COMPLETED")
print("=" * 65)