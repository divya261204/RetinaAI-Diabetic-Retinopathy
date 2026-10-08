import os
import sys
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

# ---------------------------------------------------------
# PROJECT PATH
# ---------------------------------------------------------

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSV_PATH = os.path.join(
    PROJECT_DIR,
    "dataset",
    "train.csv"
)

IMAGE_DIR = os.path.join(
    PROJECT_DIR,
    "dataset",
    "train_images"
)

MODEL_OUTPUT = os.path.join(
    PROJECT_DIR,
    "experiments",
    "balanced_cnn.keras"
)

# ---------------------------------------------------------
# IMPORT EXISTING CNN ARCHITECTURE
# ---------------------------------------------------------

sys.path.insert(0, PROJECT_DIR)

from models.model import create_model


# ---------------------------------------------------------
# SETTINGS
# ---------------------------------------------------------

IMAGE_SIZE = (224, 224)
NUM_CLASSES = 5
BATCH_SIZE = 32
EPOCHS = 30
RANDOM_STATE = 42


# ---------------------------------------------------------
# CLASS NAMES
# ---------------------------------------------------------

CLASS_NAMES = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative"
}


# ---------------------------------------------------------
# LOAD DATASET
# ---------------------------------------------------------

print("\n==============================================")
print("RETINAAI - BALANCED CNN TRAINING")
print("==============================================")

print("\nLoading CSV...")

df = pd.read_csv(CSV_PATH)

print("Total records:", len(df))

# ---------------------------------------------------------
# CHECK IMAGE FILES
# ---------------------------------------------------------

print("\nChecking image files...")

valid_rows = []

for _, row in df.iterrows():

    image_id = str(row["id_code"])
    image_path = os.path.join(
        IMAGE_DIR,
        image_id + ".png"
    )

    if os.path.exists(image_path):
        valid_rows.append(row)

df = pd.DataFrame(valid_rows).reset_index(drop=True)

print("Valid images:", len(df))

# ---------------------------------------------------------
# DISPLAY CLASS DISTRIBUTION
# ---------------------------------------------------------

print("\nClass distribution:")

for class_id in range(NUM_CLASSES):

    count = int(
        (df["diagnosis"] == class_id).sum()
    )

    print(
        f"{class_id} - "
        f"{CLASS_NAMES[class_id]}: "
        f"{count}"
    )


# ---------------------------------------------------------
# TRAIN / VALIDATION / TEST SPLIT
# ---------------------------------------------------------

print("\nCreating stratified dataset split...")

train_df, temp_df = train_test_split(
    df,
    test_size=0.30,
    stratify=df["diagnosis"],
    random_state=RANDOM_STATE
)

validation_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    stratify=temp_df["diagnosis"],
    random_state=RANDOM_STATE
)

print("\nDataset split:")

print("Training images:   ", len(train_df))
print("Validation images: ", len(validation_df))
print("Test images:       ", len(test_df))


# ---------------------------------------------------------
# IMAGE LOADING FUNCTION
# ---------------------------------------------------------

def load_dataset(dataframe):

    images = []
    labels = []

    total = len(dataframe)

    print(f"\nLoading {total} images...")

    for counter, (_, row) in enumerate(
        dataframe.iterrows(),
        start=1
    ):

        image_id = str(row["id_code"])

        image_path = os.path.join(
            IMAGE_DIR,
            image_id + ".png"
        )

        try:

            image = load_img(
                image_path,
                target_size=IMAGE_SIZE,
                color_mode="rgb"
            )

            image = img_to_array(image)

            image = image / 255.0

            images.append(image)

            labels.append(
                int(row["diagnosis"])
            )

        except Exception as error:

            print(
                f"\nError loading {image_id}: "
                f"{error}"
            )

        if counter % 250 == 0 or counter == total:

            print(
                f"Loaded {counter}/{total}"
            )

    return (
        np.array(images, dtype=np.float32),
        np.array(labels, dtype=np.int32)
    )


# ---------------------------------------------------------
# LOAD TRAINING DATA
# ---------------------------------------------------------

X_train, y_train = load_dataset(train_df)


# ---------------------------------------------------------
# LOAD VALIDATION DATA
# ---------------------------------------------------------

X_validation, y_validation = load_dataset(
    validation_df
)


# ---------------------------------------------------------
# LOAD TEST DATA
# ---------------------------------------------------------

X_test, y_test = load_dataset(test_df)


# ---------------------------------------------------------
# DISPLAY SHAPES
# ---------------------------------------------------------

print("\nDataset shapes:")

print("X_train:      ", X_train.shape)
print("y_train:      ", y_train.shape)

print("X_validation: ", X_validation.shape)
print("y_validation: ", y_validation.shape)

print("X_test:       ", X_test.shape)
print("y_test:       ", y_test.shape)


# ---------------------------------------------------------
# CALCULATE CLASS WEIGHTS
# ---------------------------------------------------------

print("\nCalculating class weights...")

classes = np.unique(y_train)

weights = compute_class_weight(
    class_weight="balanced",
    classes=classes,
    y=y_train
)

class_weights = {
    int(class_id): float(weight)
    for class_id, weight in zip(
        classes,
        weights
    )
}

print("\nClass weights:")

for class_id in range(NUM_CLASSES):

    print(
        f"{class_id} - "
        f"{CLASS_NAMES[class_id]}: "
        f"{class_weights[class_id]:.4f}"
    )


# ---------------------------------------------------------
# BUILD CNN
# ---------------------------------------------------------

print("\nCreating CNN model...")

model = create_model()

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

print("\nModel created successfully.")

model.summary()


# ---------------------------------------------------------
# CALLBACKS
# ---------------------------------------------------------

early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True,
    verbose=1
)

reduce_learning_rate = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.5,
    patience=2,
    min_lr=0.000001,
    verbose=1
)

checkpoint = ModelCheckpoint(
    MODEL_OUTPUT,
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)


# ---------------------------------------------------------
# TRAIN MODEL
# ---------------------------------------------------------

print("\n==============================================")
print("STARTING BALANCED CNN TRAINING")
print("==============================================")

history = model.fit(
    X_train,
    y_train,

    validation_data=(
        X_validation,
        y_validation
    ),

    epochs=EPOCHS,

    batch_size=BATCH_SIZE,

    class_weight=class_weights,

    callbacks=[
        early_stopping,
        reduce_learning_rate,
        checkpoint
    ],

    verbose=1
)


# ---------------------------------------------------------
# TEST MODEL
# ---------------------------------------------------------

print("\n==============================================")
print("EVALUATING BALANCED CNN")
print("==============================================")

test_loss, test_accuracy = model.evaluate(
    X_test,
    y_test,
    verbose=1
)

print("\nTest Loss:", test_loss)

print(
    "Test Accuracy:",
    f"{test_accuracy * 100:.2f}%"
)


# ---------------------------------------------------------
# SAVE FINAL MODEL
# ---------------------------------------------------------

model.save(MODEL_OUTPUT)

print("\nBalanced CNN saved successfully:")

print(MODEL_OUTPUT)


# ---------------------------------------------------------
# SAVE TRAINING HISTORY
# ---------------------------------------------------------

history_path = os.path.join(
    PROJECT_DIR,
    "experiments",
    "balanced_training_history.csv"
)

history_dataframe = pd.DataFrame(
    history.history
)

history_dataframe.to_csv(
    history_path,
    index=False
)

print("\nTraining history saved:")

print(history_path)


# ---------------------------------------------------------
# FINAL INFORMATION
# ---------------------------------------------------------

print("\n==============================================")
print("TRAINING COMPLETED")
print("==============================================")

print(
    "\nOriginal model remains unchanged:"
)

print(
    os.path.join(
        PROJECT_DIR,
        "models",
        "diabetic_retinopathy_model.keras"
    )
)

print(
    "\nNew balanced model:"
)

print(MODEL_OUTPUT)

print("\nNext step will be model comparison.")