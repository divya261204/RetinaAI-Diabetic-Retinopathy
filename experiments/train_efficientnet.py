import os
import sys
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support
from tensorflow.keras import layers, Model, regularizers
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping

# ============================================================
# CONFIGURATION & HYPERPARAMETERS
# ============================================================

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(PROJECT_ROOT, "dataset", "train.csv")
IMAGE_DIR = os.path.join(PROJECT_ROOT, "dataset", "train_images")

MODEL_OUTPUT = os.path.join(PROJECT_ROOT, "experiments", "efficientnet_b0.keras")
HISTORY_OUTPUT = os.path.join(PROJECT_ROOT, "experiments", "efficientnet_b0_history.csv")
EVAL_DIR = os.path.join(PROJECT_ROOT, "evaluation")
os.makedirs(EVAL_DIR, exist_ok=True)

IMAGE_SIZE = (224, 224)
NUM_CLASSES = 5
BATCH_SIZE = 32
EPOCHS = 12
RANDOM_STATE = 42

CLASS_NAMES = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]

print("=" * 65)
print("EFFICIENTNET-B0 TRAINING & FINE-TUNING PIPELINE")
print("=" * 65)

# ============================================================
# LOAD DATASET
# ============================================================

df = pd.read_csv(CSV_PATH)
valid_rows = []
for _, row in df.iterrows():
    img_p = os.path.join(IMAGE_DIR, row["id_code"] + ".png")
    if os.path.exists(img_p):
        valid_rows.append(row)

df = pd.DataFrame(valid_rows).reset_index(drop=True)
print(f"Total verified fundus images: {len(df)}")

# Train (70%), Val (15%), Test (15%) Stratified Split
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

print(f"Training set:   {len(train_df)} images")
print(f"Validation set: {len(val_df)} images")
print(f"Testing set:    {len(test_df)} images")

# ============================================================
# TF.DATA PIPELINE (Memory-Efficient & High Performance)
# ============================================================

def process_path(file_path, label):
    img = tf.io.read_file(file_path)
    img = tf.image.decode_png(img, channels=3)
    img = tf.image.resize(img, IMAGE_SIZE)
    # EfficientNet requires input in range [0, 255] or handled by preprocess_input
    img = tf.keras.applications.efficientnet.preprocess_input(img)
    label_one_hot = tf.one_hot(label, depth=NUM_CLASSES)
    return img, label_one_hot

def create_dataset(dataframe, is_training=False):
    file_paths = [os.path.join(IMAGE_DIR, f"{row['id_code']}.png") for _, row in dataframe.iterrows()]
    labels = dataframe["diagnosis"].values.astype(np.int32)
    
    ds = tf.data.Dataset.from_tensor_slices((file_paths, labels))
    ds = ds.map(process_path, num_parallel_calls=tf.data.AUTOTUNE)
    
    if is_training:
        ds = ds.shuffle(buffer_size=1000, seed=RANDOM_STATE)
    
    ds = ds.batch(BATCH_SIZE).prefetch(buffer_size=tf.data.AUTOTUNE)
    return ds

train_ds = create_dataset(train_df, is_training=True)
val_ds = create_dataset(val_df, is_training=False)
test_ds = create_dataset(test_df, is_training=False)

# ============================================================
# CLASS WEIGHTS
# ============================================================

y_train_labels = train_df["diagnosis"].values
class_weights_arr = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y_train_labels),
    y=y_train_labels
)
class_weights = {i: float(w) for i, w in enumerate(class_weights_arr)}
print("Calculated Class Weights:", class_weights)

# ============================================================
# MODEL ARCHITECTURE
# ============================================================

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(height_factor=(-0.1, 0.1), width_factor=(-0.1, 0.1)),
    layers.RandomContrast(0.1),
], name="data_augmentation")

base_model = EfficientNetB0(
    include_top=False,
    weights="imagenet",
    input_shape=(224, 224, 3)
)

# Unfreeze top layers of EfficientNet for fine-tuning
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

inputs = layers.Input(shape=(224, 224, 3), name="input_image")
x = data_augmentation(inputs)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D(name="global_average_pooling2d")(x)
x = layers.BatchNormalization()(x)
x = layers.Dense(256, activation="relu", kernel_regularizer=regularizers.l2(1e-4), name="dense_dense")(x)
x = layers.Dropout(0.4, name="dropout_1")(x)
x = layers.Dense(128, activation="relu", name="dense_features")(x)
x = layers.Dropout(0.3, name="dropout_2")(x)
outputs = layers.Dense(NUM_CLASSES, activation="softmax", name="predictions")(x)

model = Model(inputs=inputs, outputs=outputs, name="EfficientNetB0_Retinopathy")

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=2e-4),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.05),
    metrics=["accuracy", tf.keras.metrics.Precision(name="precision"), tf.keras.metrics.Recall(name="recall")]
)

model.summary()

# ============================================================
# CALLBACKS & TRAINING
# ============================================================

callbacks = [
    ModelCheckpoint(
        filepath=MODEL_OUTPUT,
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-6,
        verbose=1
    ),
    EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
]

print("\nStarting training...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks,
    verbose=1
)

# Save history
hist_df = pd.DataFrame(history.history)
hist_df.to_csv(HISTORY_OUTPUT, index=False)
print(f"\nTraining history saved to: {HISTORY_OUTPUT}")

# ============================================================
# EVALUATION ON TEST SET
# ============================================================

print("\n" + "=" * 65)
print("EVALUATING MODEL ON HELD-OUT TEST SET")
print("=" * 65)

# Load best model
best_model = tf.keras.models.load_model(MODEL_OUTPUT)

y_true = []
y_pred_probs = []

for imgs, lbls in test_ds:
    preds = best_model.predict(imgs, verbose=0)
    y_true.extend(np.argmax(lbls.numpy(), axis=-1))
    y_pred_probs.extend(preds)

y_true = np.array(y_true)
y_pred_probs = np.array(y_pred_probs)
y_pred = np.argmax(y_pred_probs, axis=-1)

test_acc = np.mean(y_true == y_pred) * 100
precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="macro")

print(f"\nTest Accuracy:   {test_acc:.2f}%")
print(f"Macro Precision: {precision * 100:.2f}%")
print(f"Macro Recall:    {recall * 100:.2f}%")
print(f"Macro F1 Score:  {f1 * 100:.2f}%")

report = classification_report(y_true, y_pred, target_names=CLASS_NAMES, digits=4)
print("\nClassification Report:\n", report)

# Save classification metrics
report_dict = classification_report(y_true, y_pred, target_names=CLASS_NAMES, output_dict=True)
pd.DataFrame(report_dict).transpose().to_csv(os.path.join(EVAL_DIR, "efficientnet_classification_report.csv"))

cm = confusion_matrix(y_true, y_pred)
pd.DataFrame(cm, index=CLASS_NAMES, columns=CLASS_NAMES).to_csv(os.path.join(EVAL_DIR, "efficientnet_confusion_matrix.csv"))

print(f"\nModel and evaluation artifacts successfully written to:\n- {MODEL_OUTPUT}\n- {EVAL_DIR}")
