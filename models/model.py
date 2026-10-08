import tensorflow as tf
from tensorflow.keras import layers, models


def create_model():
    model = models.Sequential([
        # Input
        layers.Input(shape=(224, 224, 3)),

        # Convolution Block 1
        layers.Conv2D(32, (3, 3), padding="same"),
        layers.ReLU(),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Convolution Block 2
        layers.Conv2D(64, (3, 3), padding="same"),
        layers.ReLU(),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Convolution Block 3
        layers.Conv2D(128, (3, 3), padding="same"),
        layers.ReLU(),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.30),

        # Convolution Block 4
        layers.Conv2D(256, (3, 3), padding="same"),
        layers.ReLU(),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.30),

        # Convolution Block 5
        layers.Conv2D(256, (3, 3), padding="same"),
        layers.ReLU(),
        layers.BatchNormalization(),

        # Feature extraction
        layers.GlobalAveragePooling2D(),

        # Classification
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.40),

        # Five DR classes
        layers.Dense(5, activation="softmax")
    ])

    return model


if __name__ == "__main__":
    model = create_model()

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    model.summary()