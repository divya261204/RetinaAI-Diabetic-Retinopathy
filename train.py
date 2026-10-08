import os
import cv2
import numpy as np
import pandas as pd
import tensorflow as tf

from tensorflow.keras.utils import Sequence, to_categorical

from models.model import create_model
from preprocessing.preprocess import preprocess_image


# ==============================
# SETTINGS
# ==============================

BATCH_SIZE = 16
EPOCHS = 10

TRAIN_CSV = "dataset/train_split.csv"
VAL_CSV = "dataset/val_split.csv"

IMAGE_FOLDER = "dataset/train_images"

MODEL_PATH = "models/diabetic_retinopathy_model.keras"


# ==============================
# BALANCED + TARGETED GENERATOR
# ==============================

class BalancedDataGenerator(Sequence):

    def __init__(
        self,
        dataframe,
        image_folder,
        batch_size=16,
        augment=False
    ):
        super().__init__()

        self.dataframe = dataframe.reset_index(drop=True)
        self.image_folder = image_folder
        self.batch_size = batch_size
        self.augment = augment

        self.class_indexes = {}

        for class_number in range(5):

            self.class_indexes[class_number] = np.where(
                self.dataframe["diagnosis"].values == class_number
            )[0]


    def __len__(self):

        return int(
            np.ceil(
                len(self.dataframe) /
                self.batch_size
            )
        )


    def __getitem__(self, index):

        # Select all five classes equally
        selected_classes = np.random.choice(
            5,
            size=self.batch_size,
            replace=True
        )

        selected_indexes = []

        for class_number in selected_classes:

            selected_indexes.append(
                np.random.choice(
                    self.class_indexes[class_number]
                )
            )


        images = []
        labels = []


        for data_index in selected_indexes:

            row = self.dataframe.iloc[data_index]

            image_name = row["id_code"] + ".png"

            image_path = os.path.join(
                self.image_folder,
                image_name
            )

            image = preprocess_image(
                image_path
            )

            diagnosis = int(
                row["diagnosis"]
            )


            # ==============================
            # TARGETED AUGMENTATION
            # ==============================

            if self.augment:

                # --------------------------------
                # Normal augmentation
                # --------------------------------

                if np.random.random() < 0.5:

                    image = cv2.flip(
                        image,
                        1
                    )


                if np.random.random() < 0.5:

                    factor = np.random.uniform(
                        0.85,
                        1.15
                    )

                    image = np.clip(
                        image * factor,
                        0.0,
                        1.0
                    )


                # --------------------------------
                # Stronger augmentation for
                # Severe and Proliferative
                # --------------------------------

                if diagnosis in [3, 4]:

                    # Small rotation
                    if np.random.random() < 0.6:

                        angle = np.random.uniform(
                            -15,
                            15
                        )

                        height, width = image.shape[:2]

                        center = (
                            width // 2,
                            height // 2
                        )

                        matrix = cv2.getRotationMatrix2D(
                            center,
                            angle,
                            1.0
                        )

                        image = cv2.warpAffine(
                            image,
                            matrix,
                            (width, height)
                        )


                    # Additional brightness variation
                    if np.random.random() < 0.5:

                        factor = np.random.uniform(
                            0.75,
                            1.25
                        )

                        image = np.clip(
                            image * factor,
                            0.0,
                            1.0
                        )


                    # Small zoom
                    if np.random.random() < 0.4:

                        height, width = image.shape[:2]

                        crop_size = int(
                            min(height, width) * 0.90
                        )

                        start_x = (
                            width - crop_size
                        ) // 2

                        start_y = (
                            height - crop_size
                        ) // 2

                        cropped = image[
                            start_y:start_y + crop_size,
                            start_x:start_x + crop_size
                        ]

                        image = cv2.resize(
                            cropped,
                            (224, 224)
                        )


            images.append(image)

            labels.append(
                diagnosis
            )


        images = np.array(
            images,
            dtype=np.float32
        )

        labels = to_categorical(
            labels,
            num_classes=5
        )

        return images, labels


# ==============================
# VALIDATION GENERATOR
# ==============================

class ValidationDataGenerator(Sequence):

    def __init__(
        self,
        dataframe,
        image_folder,
        batch_size=16
    ):
        super().__init__()

        self.dataframe = dataframe.reset_index(
            drop=True
        )

        self.image_folder = image_folder
        self.batch_size = batch_size


    def __len__(self):

        return int(
            np.ceil(
                len(self.dataframe) /
                self.batch_size
            )
        )


    def __getitem__(self, index):

        batch_data = self.dataframe.iloc[
            index * self.batch_size:
            (index + 1) * self.batch_size
        ]

        images = []
        labels = []


        for _, row in batch_data.iterrows():

            image_name = row["id_code"] + ".png"

            image_path = os.path.join(
                self.image_folder,
                image_name
            )

            image = preprocess_image(
                image_path
            )

            images.append(image)

            labels.append(
                int(row["diagnosis"])
            )


        images = np.array(
            images,
            dtype=np.float32
        )

        labels = to_categorical(
            labels,
            num_classes=5
        )

        return images, labels


# ==============================
# TRAINING
# ==============================

def main():

    print("Loading dataset...")

    train_df = pd.read_csv(
        TRAIN_CSV
    )

    val_df = pd.read_csv(
        VAL_CSV
    )

    print(
        "Training images:",
        len(train_df)
    )

    print(
        "Validation images:",
        len(val_df)
    )


    # ==============================
    # CLASS DISTRIBUTION
    # ==============================

    print("\nTraining class distribution:")

    print(
        train_df["diagnosis"]
        .value_counts()
        .sort_index()
    )


    # ==============================
    # GENERATORS
    # ==============================

    print(
        "\nCreating balanced generator..."
    )

    train_generator = BalancedDataGenerator(
        dataframe=train_df,
        image_folder=IMAGE_FOLDER,
        batch_size=BATCH_SIZE,
        augment=True
    )


    validation_generator = ValidationDataGenerator(
        dataframe=val_df,
        image_folder=IMAGE_FOLDER,
        batch_size=BATCH_SIZE
    )


    # ==============================
    # CREATE MODEL
    # ==============================

    print("\nCreating CNN model...")

    model = create_model()


    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=0.0001
        ),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )


    # ==============================
    # CALLBACKS
    # ==============================

    checkpoint = tf.keras.callbacks.ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        mode="max"
    )


    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=0.000001
    )


    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    )


    # ==============================
    # TRAIN
    # ==============================

    print(
        "\nStarting targeted training..."
    )


    model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=EPOCHS,
        callbacks=[
            checkpoint,
            reduce_lr,
            early_stopping
        ]
    )


    print("\nTraining completed!")

    print(
        "Model saved at:",
        MODEL_PATH
    )


# ==============================
# MAIN
# ==============================

if __name__ == "__main__":
    main()