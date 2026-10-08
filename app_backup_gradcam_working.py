import os
import io
from datetime import datetime

import cv2
import numpy as np
import tensorflow as tf

from PIL import Image
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from preprocessing.preprocess import preprocess_image


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="RetinaAI",
    description=(
        "Lightweight CNN-Based "
        "Diabetic Retinopathy Screening"
    ),
    version="1.0"
)


# ============================================================
# DIRECTORIES
# ============================================================

STATIC_DIR = os.path.join(
    PROJECT_ROOT,
    "static"
)

TEMPLATES_DIR = os.path.join(
    PROJECT_ROOT,
    "templates"
)

UPLOAD_DIR = os.path.join(
    STATIC_DIR,
    "uploads"
)

RESULT_DIR = os.path.join(
    STATIC_DIR,
    "results"
)

REPORT_DIR = os.path.join(
    STATIC_DIR,
    "reports"
)


os.makedirs(
    STATIC_DIR,
    exist_ok=True
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

os.makedirs(
    RESULT_DIR,
    exist_ok=True
)

os.makedirs(
    REPORT_DIR,
    exist_ok=True
)


# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/static",
    StaticFiles(
        directory=STATIC_DIR
    ),
    name="static"
)


# ============================================================
# TEMPLATES
# ============================================================

templates = Jinja2Templates(
    directory=TEMPLATES_DIR
)


# ============================================================
# LOAD FINE-TUNED MOBILENETV2
# ============================================================

MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "experiments",
    "mobilenetv2_finetuned.keras"
)

print(
    "Loading fine-tuned MobileNetV2 model..."
)


try:

    model = tf.keras.models.load_model(
        MODEL_PATH
    )

except Exception as e:

    print(
        "MODEL LOADING ERROR:",
        str(e)
    )

    raise


print(
    "Model loaded successfully!"
)

print(
    "Model input shape:",
    model.input_shape
)

print(
    "Model output shape:",
    model.output_shape
)


# ============================================================
# MODEL VALIDATION
# ============================================================

if model.input_shape[-3:] != (
    224,
    224,
    3
):

    raise ValueError(
        "Unexpected model input shape: "
        + str(model.input_shape)
    )


if model.output_shape[-1] != 5:

    raise ValueError(
        "Unexpected model output shape: "
        + str(model.output_shape)
    )


# ============================================================
# CLASS NAMES
# ============================================================

class_names = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]


# ============================================================
# MOBILENETV2 BACKBONE
# ============================================================

backbone = model.get_layer(
    "mobilenetv2_1.00_224"
)

print(
    "MobileNetV2 backbone found:",
    backbone.name
)


# ============================================================
# GRAD-CAM LAYER
# ============================================================

last_conv_layer = backbone.get_layer(
    "Conv_1"
)

print(
    "Grad-CAM layer selected:",
    last_conv_layer.name
)

print(
    "Grad-CAM layer output:",
    last_conv_layer.output.shape
)


# ============================================================
# CONNECTED GRAD-CAM MODEL
# ============================================================

gradcam_model = None


try:

    # --------------------------------------------------------
    # Create one connected model that exposes:
    #
    # 1. Conv_1 feature maps
    # 2. Final 5-class predictions
    #
    # Both are generated from the SAME input graph.
    # --------------------------------------------------------

    gradcam_input = tf.keras.Input(
        shape=(224, 224, 3),
        name="gradcam_input"
    )


    # --------------------------------------------------------
    # Backbone model
    #
    # This produces Conv_1 activations AND final
    # MobileNetV2 feature output from the same graph.
    # --------------------------------------------------------

    gradcam_backbone = tf.keras.Model(
        inputs=backbone.input,
        outputs=[
            last_conv_layer.output,
            backbone.output
        ],
        name="gradcam_backbone"
    )


    conv_outputs, backbone_output = (
        gradcam_backbone(
            gradcam_input,
            training=False
        )
    )


    # --------------------------------------------------------
    # Recreate the classifier using the exact trained layers
    # from the loaded model.
    # --------------------------------------------------------

    x = model.get_layer(
        "global_average_pooling2d"
    )(
        backbone_output
    )


    x = model.get_layer(
        "dropout"
    )(
        x,
        training=False
    )


    x = model.get_layer(
        "dense"
    )(
        x
    )


    x = model.get_layer(
        "dropout_1"
    )(
        x,
        training=False
    )


    predictions = model.get_layer(
        "dense_1"
    )(
        x
    )


    # --------------------------------------------------------
    # Final connected Grad-CAM model
    # --------------------------------------------------------

    gradcam_model = tf.keras.Model(
        inputs=gradcam_input,
        outputs=[
            conv_outputs,
            predictions
        ],
        name="connected_gradcam_model"
    )


    print(
        "Connected Grad-CAM model created successfully."
    )

    print(
        "Grad-CAM output:",
        conv_outputs.shape
    )

    print(
        "Grad-CAM predictions:",
        predictions.shape
    )


except Exception as e:

    print(
        "Grad-CAM model creation error:",
        str(e)
    )

    gradcam_model = None


# ============================================================
# IMAGE QUALITY CHECK
# ============================================================

def check_image_quality(image):

    if image is None:

        return {

            "status": "Poor",

            "message":
                "Image could not be read.",

            "resolution":
                "Unknown",

            "brightness":
                "Unknown",

            "sharpness":
                "Unknown",

            "issues": [
                "Image could not be read"
            ]
        }


    try:

        height, width = (
            image.shape[:2]
        )


        gray = cv2.cvtColor(
            image,
            cv2.COLOR_RGB2GRAY
        )


        brightness = float(
            np.mean(gray)
        )


        sharpness = float(
            cv2.Laplacian(
                gray,
                cv2.CV_64F
            ).var()
        )


        issues = []


        # ----------------------------------------------------
        # Resolution
        # ----------------------------------------------------

        if (
            width < 224
            or
            height < 224
        ):

            issues.append(
                "Image resolution is below 224×224"
            )


        # ----------------------------------------------------
        # Brightness
        # ----------------------------------------------------

        if brightness < 35:

            issues.append(
                "Image is too dark"
            )

        elif brightness > 225:

            issues.append(
                "Image is too bright"
            )


        # ----------------------------------------------------
        # Sharpness
        # ----------------------------------------------------

        if sharpness < 20:

            issues.append(
                "Image may be blurry"
            )


        # ----------------------------------------------------
        # Status
        # ----------------------------------------------------

        if len(issues) == 0:

            status = "Good"

            message = (
                "Image quality is suitable "
                "for screening."
            )

        else:

            status = "Review"

            message = (
                "Image quality may affect "
                "the model output."
            )


        return {

            "status":
                status,

            "message":
                message,

            "resolution":
                f"{width}×{height}",

            "brightness":
                round(
                    brightness,
                    1
                ),

            "sharpness":
                round(
                    sharpness,
                    1
                ),

            "issues":
                issues
        }


    except Exception as e:

        return {

            "status":
                "Poor",

            "message":
                "Unable to evaluate image quality.",

            "resolution":
                "Unknown",

            "brightness":
                "Unknown",

            "sharpness":
                "Unknown",

            "issues": [
                str(e)
            ]
        }


# ============================================================
# GRAD-CAM
# ============================================================

def generate_gradcam(
    image_array,
    processed_image,
    predicted_class
):

    try:

        # ----------------------------------------------------
        # Check model
        # ----------------------------------------------------

        if gradcam_model is None:

            raise RuntimeError(
                "Grad-CAM model is not available."
            )


        # ----------------------------------------------------
        # Prepare input
        # ----------------------------------------------------

        input_tensor = tf.convert_to_tensor(
            processed_image,
            dtype=tf.float32
        )


        if len(input_tensor.shape) == 3:

            input_tensor = tf.expand_dims(
                input_tensor,
                axis=0
            )


        # ----------------------------------------------------
        # Gradient calculation
        # ----------------------------------------------------

        with tf.GradientTape() as tape:

            conv_outputs, predictions = (
                gradcam_model(
                    input_tensor,
                    training=False
                )
            )

            # Explicitly watch the feature tensor.
            # This is important because conv_outputs is an
            # intermediate tensor rather than a trainable
            # variable.

            tape.watch(
                conv_outputs
            )


            class_channel = predictions[
                :,
                predicted_class
            ]


        # ----------------------------------------------------
        # Calculate gradients
        # ----------------------------------------------------

        grads = tape.gradient(
            class_channel,
            conv_outputs
        )


        if grads is None:

            raise RuntimeError(
                "Gradients could not be calculated."
            )


        # ----------------------------------------------------
        # Global average pooling
        # ----------------------------------------------------

        pooled_grads = tf.reduce_mean(
            grads,
            axis=(0, 1, 2)
        )


        # Remove batch dimension
        conv_outputs = (
            conv_outputs[0]
        )


        # ----------------------------------------------------
        # Weighted feature maps
        # ----------------------------------------------------

        heatmap = tf.reduce_sum(
            conv_outputs *
            pooled_grads,
            axis=-1
        )


        # ----------------------------------------------------
        # ReLU
        # ----------------------------------------------------

        heatmap = tf.maximum(
            heatmap,
            0
        )


        # ----------------------------------------------------
        # Normalize
        # ----------------------------------------------------

        max_value = tf.reduce_max(
            heatmap
        )


        max_value_float = float(
            max_value.numpy()
        )


        if max_value_float > 0:

            heatmap = (
                heatmap /
                max_value
            )

        else:

            raise RuntimeError(
                "Grad-CAM heatmap contains "
                "no positive activation."
            )


        heatmap = heatmap.numpy()


        # ----------------------------------------------------
        # Validate heatmap
        # ----------------------------------------------------

        if not np.isfinite(
            heatmap
        ).all():

            raise RuntimeError(
                "Grad-CAM heatmap contains "
                "invalid values."
            )


        # ----------------------------------------------------
        # Resize heatmap
        # ----------------------------------------------------

        original_height, original_width = (
            image_array.shape[:2]
        )


        heatmap = cv2.resize(
            heatmap,
            (
                original_width,
                original_height
            )
        )


        # ----------------------------------------------------
        # Convert to uint8
        # ----------------------------------------------------

        heatmap_uint8 = np.uint8(
            255 * np.clip(
                heatmap,
                0,
                1
            )
        )


        # ----------------------------------------------------
        # Color map
        # ----------------------------------------------------

        heatmap_color = cv2.applyColorMap(
            heatmap_uint8,
            cv2.COLORMAP_JET
        )


        # ----------------------------------------------------
        # Original image
        # ----------------------------------------------------

        original_bgr = cv2.cvtColor(
            image_array,
            cv2.COLOR_RGB2BGR
        )


        # ----------------------------------------------------
        # Overlay
        # ----------------------------------------------------

        overlay = cv2.addWeighted(
            original_bgr,
            0.60,
            heatmap_color,
            0.40,
            0
        )


        # ----------------------------------------------------
        # Filenames
        # ----------------------------------------------------

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S_%f"
        )


        heatmap_filename = (
            "gradcam_heatmap_"
            + timestamp
            + ".jpg"
        )


        overlay_filename = (
            "gradcam_overlay_"
            + timestamp
            + ".jpg"
        )


        heatmap_path = os.path.join(
            RESULT_DIR,
            heatmap_filename
        )


        overlay_path = os.path.join(
            RESULT_DIR,
            overlay_filename
        )


        # ----------------------------------------------------
        # Save heatmap
        # ----------------------------------------------------

        heatmap_saved = cv2.imwrite(
            heatmap_path,
            heatmap_color
        )


        overlay_saved = cv2.imwrite(
            overlay_path,
            overlay
        )


        if not heatmap_saved:

            raise RuntimeError(
                "Unable to save Grad-CAM heatmap."
            )


        if not overlay_saved:

            raise RuntimeError(
                "Unable to save Grad-CAM overlay."
            )


        # ----------------------------------------------------
        # Verify files
        # ----------------------------------------------------

        if not os.path.exists(
            heatmap_path
        ):

            raise RuntimeError(
                "Grad-CAM heatmap file was not created."
            )


        if not os.path.exists(
            overlay_path
        ):

            raise RuntimeError(
                "Grad-CAM overlay file was not created."
            )


        # ----------------------------------------------------
        # Interpretation
        # ----------------------------------------------------

        interpretation = (
            "The Grad-CAM heatmap highlights image "
            "regions that contributed more strongly "
            "to the model's prediction. It is an "
            "AI interpretability aid and does not "
            "prove that a highlighted region represents "
            "a disease lesion."
        )


        # ----------------------------------------------------
        # Return all names used by result.html
        # ----------------------------------------------------

        return {

            "success":
                True,

            "heatmap_image":
                "/static/results/"
                + heatmap_filename,

            "result_image":
                "/static/results/"
                + overlay_filename,

            "interpretation":
                interpretation,

            # Compatibility keys
            "heatmap":
                "/static/results/"
                + heatmap_filename,

            "overlay":
                "/static/results/"
                + overlay_filename,

            "error":
                None
        }


    except Exception as e:

        print(
            "Grad-CAM error:",
            str(e)
        )


        return {

            "success":
                False,

            "heatmap_image":
                None,

            "result_image":
                None,

            "heatmap":
                None,

            "overlay":
                None,

            "interpretation":
                "Grad-CAM could not be generated "
                "for this image.",

            "error":
                str(e)
        }


# ============================================================
# HOME ROUTE
# ============================================================

@app.get(
    "/",
    response_class=HTMLResponse
)
async def home(
    request: Request
):

    return templates.TemplateResponse(

        request=request,

        name="index.html",

        context={
            "request": request
        }
    )


# ============================================================
# HEALTH ROUTE
# ============================================================

@app.get(
    "/health"
)
async def health():

    return {

        "status":
            "healthy",

        "model_loaded":
            model is not None,

        "model":
            "Fine-tuned MobileNetV2",

        "classes":
            class_names,

        "input_size":
            "224x224",

        "gradcam":
            gradcam_model is not None
    }


# ============================================================
# CREATE SCREENING REPORT
# ============================================================

def create_screening_report(
    prediction,
    confidence,
    probabilities,
    quality,
    image_filename
):

    timestamp = datetime.now().strftime(
        "%d-%m-%Y %H:%M:%S"
    )


    report_filename = (
        "screening_report_"
        + datetime.now().strftime(
            "%Y%m%d_%H%M%S_%f"
        )
        + ".pdf"
    )


    report_path = os.path.join(
        REPORT_DIR,
        report_filename
    )


    try:

        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas


        c = canvas.Canvas(
            report_path,
            pagesize=A4
        )


        width, height = A4


        # ----------------------------------------------------
        # Header
        # ----------------------------------------------------

        c.setFont(
            "Helvetica-Bold",
            20
        )


        c.drawString(
            50,
            height - 60,
            "RetinaAI Screening Report"
        )


        c.setFont(
            "Helvetica",
            10
        )


        c.drawString(
            50,
            height - 80,
            "Lightweight CNN • Multi-Class Classification • Explainable AI"
        )


        # ----------------------------------------------------
        # Date
        # ----------------------------------------------------

        y = height - 120


        c.setFont(
            "Helvetica",
            11
        )


        c.drawString(
            50,
            y,
            f"Date & Time: {timestamp}"
        )


        y -= 25


        c.drawString(
            50,
            y,
            f"Image: {image_filename}"
        )


        # ----------------------------------------------------
        # Screening result
        # ----------------------------------------------------

        y -= 45


        c.setFont(
            "Helvetica-Bold",
            14
        )


        c.drawString(
            50,
            y,
            "Screening Result"
        )


        y -= 25


        c.setFont(
            "Helvetica",
            12
        )


        c.drawString(
            50,
            y,
            f"Model Output: {prediction}"
        )


        y -= 22


        c.drawString(
            50,
            y,
            f"Model Confidence: {confidence:.2f}%"
        )


        # ----------------------------------------------------
        # Probabilities
        # ----------------------------------------------------

        y -= 45


        c.setFont(
            "Helvetica-Bold",
            14
        )


        c.drawString(
            50,
            y,
            "Class Probabilities"
        )


        y -= 25


        c.setFont(
            "Helvetica",
            11
        )


        for label, probability in zip(
            class_names,
            probabilities
        ):

            c.drawString(
                60,
                y,
                f"{label}: {probability:.2f}%"
            )


            y -= 20


        # ----------------------------------------------------
        # Image quality
        # ----------------------------------------------------

        y -= 20


        c.setFont(
            "Helvetica-Bold",
            14
        )


        c.drawString(
            50,
            y,
            "Image Quality"
        )


        y -= 25


        c.setFont(
            "Helvetica",
            11
        )


        c.drawString(
            60,
            y,
            f"Status: {quality.get('status', 'Unknown')}"
        )


        y -= 20


        c.drawString(
            60,
            y,
            f"Resolution: {quality.get('resolution', 'Unknown')}"
        )


        y -= 20


        c.drawString(
            60,
            y,
            f"Brightness: {quality.get('brightness', 'Unknown')}"
        )


        y -= 20


        c.drawString(
            60,
            y,
            f"Sharpness: {quality.get('sharpness', 'Unknown')}"
        )


        # ----------------------------------------------------
        # Disclaimer
        # ----------------------------------------------------

        y -= 50


        c.setFont(
            "Helvetica-Bold",
            11
        )


        c.drawString(
            50,
            y,
            "Important Notice"
        )


        y -= 20


        c.setFont(
            "Helvetica",
            9
        )


        disclaimer_lines = [

            "This application is an academic AI screening prototype.",

            "The model output is not a medical diagnosis.",

            "Model confidence should not be interpreted as clinical certainty.",

            "Grad-CAM is provided as an interpretability aid.",

            "Professional review is recommended for medical decisions."
        ]


        for line in disclaimer_lines:

            c.drawString(
                60,
                y,
                line
            )


            y -= 15


        c.save()


        return report_filename


    except Exception as e:

        print(
            "PDF report error:",
            str(e)
        )


        return None


# ============================================================
# DOWNLOAD REPORT
# ============================================================

@app.get(
    "/download-report/{report_filename}"
)
async def download_report(
    report_filename: str
):

    report_path = os.path.join(
        REPORT_DIR,
        report_filename
    )


    if not os.path.exists(
        report_path
    ):

        return {
            "error":
                "Report not found."
        }


    return FileResponse(
        report_path,
        media_type="application/pdf",
        filename=report_filename
    )


# ============================================================
# PREDICTION ROUTE
# ============================================================

@app.post(
    "/predict",
    response_class=HTMLResponse
)
async def predict(
    request: Request,
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    if not file.filename:

        return templates.TemplateResponse(

            request=request,

            name="index.html",

            context={

                "request":
                    request,

                "error":
                    "Please select an image."
            }
        )


    # --------------------------------------------------------
    # Validate extension
    # --------------------------------------------------------

    allowed_extensions = [
        ".jpg",
        ".jpeg",
        ".png"
    ]


    filename_lower = (
        file.filename.lower()
    )


    if not any(
        filename_lower.endswith(ext)
        for ext in allowed_extensions
    ):

        return templates.TemplateResponse(

            request=request,

            name="index.html",

            context={

                "request":
                    request,

                "error":
                    "Please upload a JPG, JPEG, or PNG image."
            }
        )


    # --------------------------------------------------------
    # Read file
    # --------------------------------------------------------

    file_bytes = await file.read()


    try:

        pil_image = Image.open(
            io.BytesIO(file_bytes)
        ).convert("RGB")


        image_array = np.array(
            pil_image
        )


    except Exception as e:

        print(
            "Image reading error:",
            str(e)
        )


        return templates.TemplateResponse(

            request=request,

            name="index.html",

            context={

                "request":
                    request,

                "error":
                    "Unable to read the uploaded image."
            }
        )


    # --------------------------------------------------------
    # Save uploaded image
    # --------------------------------------------------------

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S_%f"
    )


    safe_filename = (
        timestamp
        + "_"
        + os.path.basename(
            file.filename
        )
    )


    upload_path = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )


    try:

        pil_image.save(
            upload_path
        )

    except Exception as e:

        print(
            "Upload save error:",
            str(e)
        )


    # --------------------------------------------------------
    # Image quality
    # --------------------------------------------------------

    quality = check_image_quality(
        image_array
    )


    # --------------------------------------------------------
    # Preprocessing
    # --------------------------------------------------------

    try:

        processed_image = (
            preprocess_image(
                image_array
            )
        )


    except Exception as e:

        print(
            "Preprocessing error:",
            str(e)
        )


        return templates.TemplateResponse(

            request=request,

            name="index.html",

            context={

                "request":
                    request,

                "error":
                    "Image preprocessing failed: "
                    + str(e)
            }
        )


    # --------------------------------------------------------
    # Convert to NumPy
    # --------------------------------------------------------

    processed_image = np.asarray(
        processed_image,
        dtype=np.float32
    )


    # --------------------------------------------------------
    # Add batch dimension
    # --------------------------------------------------------

    if processed_image.ndim == 3:

        processed_image = np.expand_dims(
            processed_image,
            axis=0
        )


    # --------------------------------------------------------
    # Validate processed image
    # --------------------------------------------------------

    if processed_image.shape != (
        1,
        224,
        224,
        3
    ):

        return templates.TemplateResponse(

            request=request,

            name="index.html",

            context={

                "request":
                    request,

                "error":
                    "Unexpected processed image shape: "
                    + str(
                        processed_image.shape
                    )
            }
        )


    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    try:

        predictions = model.predict(
            processed_image,
            verbose=0
        )


    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )


        return templates.TemplateResponse(

            request=request,

            name="index.html",

            context={

                "request":
                    request,

                "error":
                    "Model prediction failed: "
                    + str(e)
            }
        )


    # --------------------------------------------------------
    # Convert probabilities to percentages
    # --------------------------------------------------------

    probabilities = (
        predictions[0] * 100
    )


    # --------------------------------------------------------
    # Predicted class
    # --------------------------------------------------------

    predicted_class = int(
        np.argmax(
            predictions[0]
        )
    )


    prediction = class_names[
        predicted_class
    ]


    confidence = float(
        probabilities[
            predicted_class
        ]
    )


    print(
        "Prediction:",
        prediction
    )


    print(
        "Confidence:",
        f"{confidence:.2f}%"
    )


    print(
        "Probabilities:",
        probabilities
    )


    # --------------------------------------------------------
    # Grad-CAM
    # --------------------------------------------------------

    gradcam_result = generate_gradcam(

        image_array=image_array,

        processed_image=processed_image,

        predicted_class=predicted_class
    )


    # --------------------------------------------------------
    # Print Grad-CAM status
    # --------------------------------------------------------

    if gradcam_result.get(
        "success",
        False
    ):

        print(
            "Grad-CAM generated successfully."
        )

    else:

        print(
            "Grad-CAM failed:",
            gradcam_result.get(
                "error"
            )
        )


    # --------------------------------------------------------
    # PDF report
    # --------------------------------------------------------

    report_filename = (
        create_screening_report(

            prediction=prediction,

            confidence=confidence,

            probabilities=probabilities,

            quality=quality,

            image_filename=safe_filename
        )
    )


    # --------------------------------------------------------
    # Image URLs
    # --------------------------------------------------------

    uploaded_image_url = (
        "/static/uploads/"
        + safe_filename
    )


    heatmap_image_url = (
        gradcam_result.get(
            "heatmap_image"
        )
    )


    result_image_url = (
        gradcam_result.get(
            "result_image"
        )
    )


    interpretation = (
        gradcam_result.get(
            "interpretation"
        )
    )


    # --------------------------------------------------------
    # Result page
    # --------------------------------------------------------

    return templates.TemplateResponse(

        request=request,

        name="result.html",

        context={

            "request":
                request,

            # Prediction
            "prediction":
                prediction,

            "confidence":
                confidence,

            "probabilities":
                probabilities.tolist(),

            "class_names":
                class_names,

            # Image quality
            "quality":
                quality,

            # Original image
            "uploaded_image":
                uploaded_image_url,

            "original_image":
                uploaded_image_url,

            # Grad-CAM
            "heatmap":
                heatmap_image_url,

            "heatmap_image":
                heatmap_image_url,

            "overlay":
                result_image_url,

            "result_image":
                result_image_url,

            "gradcam_success":
                gradcam_result.get(
                    "success",
                    False
                ),

            "gradcam_error":
                gradcam_result.get(
                    "error"
                ),

            "interpretation":
                interpretation,

            # PDF
            "report_filename":
                report_filename,

            "report_url":
                (
                    "/download-report/"
                    + report_filename
                    if report_filename
                    else None
                )
        }
    )


# ============================================================
# APPLICATION STARTUP MESSAGE
# ============================================================

print(
    "RetinaAI application initialized."
)