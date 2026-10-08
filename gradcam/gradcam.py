import os
import sys
import cv2
import numpy as np
import tensorflow as tf

# Add project root to Python path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from preprocessing.preprocess import preprocess_image


# ==============================
# PATHS
# ==============================

MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "models",
    "diabetic_retinopathy_model.keras"
)

IMAGE_FOLDER = os.path.join(
    PROJECT_ROOT,
    "dataset",
    "train_images"
)

OUTPUT_PATH = os.path.join(
    PROJECT_ROOT,
    "gradcam",
    "gradcam_result.jpg"
)

# Use the same sample image
IMAGE_NAME = "000c1434d8d7.png"

IMAGE_PATH = os.path.join(
    IMAGE_FOLDER,
    IMAGE_NAME
)


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
# LOAD MODEL
# ==============================

print("Loading model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully!")


# ==============================
# FIND LAST CONVOLUTION LAYER
# ==============================

conv_layer = None

for layer in reversed(model.layers):
    if isinstance(layer, tf.keras.layers.Conv2D):
        conv_layer = layer
        break

if conv_layer is None:
    raise ValueError("No convolutional layer found.")

print("Last convolution layer:", conv_layer.name)


# ==============================
# CREATE FRESH FUNCTIONAL GRAPH
# ==============================

print("\nCreating Grad-CAM model...")

new_input = tf.keras.Input(
    shape=(224, 224, 3)
)

x = new_input
conv_output = None

for layer in model.layers:

    x = layer(x)

    if layer.name == conv_layer.name:
        conv_output = x


grad_model = tf.keras.Model(
    inputs=new_input,
    outputs=[conv_output, x]
)

print("Grad-CAM model created successfully!")


# ==============================
# LOAD IMAGE
# ==============================

print("\nLoading image...")

original_image = cv2.imread(IMAGE_PATH)

if original_image is None:
    raise ValueError(
        f"Could not load image: {IMAGE_PATH}"
    )

original_image = cv2.cvtColor(
    original_image,
    cv2.COLOR_BGR2RGB
)

print("Image loaded successfully!")


# ==============================
# PREPROCESS IMAGE
# ==============================

print("\nPreprocessing image...")

processed_image = preprocess_image(
    IMAGE_PATH
)

input_tensor = tf.convert_to_tensor(
    processed_image,
    dtype=tf.float32
)

input_tensor = tf.expand_dims(
    input_tensor,
    axis=0
)

print("Image preprocessed successfully!")


# ==============================
# PREDICTION + GRADIENTS
# ==============================

print("\nGenerating prediction and Grad-CAM...")

with tf.GradientTape() as tape:

    conv_outputs, predictions = grad_model(
        input_tensor,
        training=False
    )

    predicted_class = tf.argmax(
        predictions[0]
    )

    class_score = predictions[
        0,
        predicted_class
    ]

gradients = tape.gradient(
    class_score,
    conv_outputs
)

if gradients is None:
    raise ValueError(
        "Gradients could not be calculated."
    )

print("Gradients calculated successfully!")


# ==============================
# GENERATE GRAD-CAM
# ==============================

conv_outputs = conv_outputs[0]
gradients = gradients[0]

# Global average pooling of gradients
weights = tf.reduce_mean(
    gradients,
    axis=(0, 1)
)

# Weighted combination of feature maps
cam = tf.reduce_sum(
    conv_outputs * weights,
    axis=-1
)

# Remove negative values
cam = tf.maximum(
    cam,
    0
)

# Normalize
cam = cam.numpy()

if np.max(cam) != 0:
    cam = cam / np.max(cam)


# ==============================
# RESIZE HEATMAP
# ==============================

heatmap = cv2.resize(
    cam,
    (
        original_image.shape[1],
        original_image.shape[0]
    )
)

heatmap = np.uint8(
    255 * heatmap
)


# ==============================
# CREATE COLORED HEATMAP
# ==============================

heatmap_color = cv2.applyColorMap(
    heatmap,
    cv2.COLORMAP_JET
)

heatmap_color = cv2.cvtColor(
    heatmap_color,
    cv2.COLOR_BGR2RGB
)


# ==============================
# OVERLAY HEATMAP
# ==============================

original_uint8 = np.uint8(
    original_image
)

overlay = cv2.addWeighted(
    original_uint8,
    0.6,
    heatmap_color,
    0.4,
    0
)


# ==============================
# ADD PREDICTION TEXT
# ==============================

prediction_index = int(
    predicted_class.numpy()
)

confidence = float(
    predictions[0, prediction_index].numpy()
)

prediction_text = (
    f"{class_names[prediction_index]} "
    f"({confidence * 100:.2f}%)"
)

cv2.putText(
    overlay,
    prediction_text,
    (30, 50),
    cv2.FONT_HERSHEY_SIMPLEX,
    1,
    (255, 255, 255),
    2,
    cv2.LINE_AA
)


# ==============================
# SAVE RESULT
# ==============================

overlay_bgr = cv2.cvtColor(
    overlay,
    cv2.COLOR_RGB2BGR
)

cv2.imwrite(
    OUTPUT_PATH,
    overlay_bgr
)


# ==============================
# FINAL OUTPUT
# ==============================

print("\n==============================")
print("TRUE GRAD-CAM COMPLETED")
print("==============================")

print(
    "Prediction:",
    class_names[prediction_index]
)

print(
    f"Confidence: {confidence * 100:.2f}%"
)

print(
    "Saved to:",
    OUTPUT_PATH
)