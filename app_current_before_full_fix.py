import os
import sys
import uuid

import cv2
import numpy as np
import tensorflow as tf

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.lib.units import inch

from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

sys.path.append(PROJECT_ROOT)


# ============================================================
# IMPORT PREPROCESSING
# ============================================================

from preprocessing.preprocess import preprocess_image


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Diabetic Retinopathy Detection System"
)


# ============================================================
# CREATE REQUIRED FOLDERS
# ============================================================

UPLOAD_FOLDER = os.path.join(
    PROJECT_ROOT,
    "static",
    "uploads"
)

RESULT_FOLDER = os.path.join(
    PROJECT_ROOT,
    "static",
    "results"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)


# ============================================================
# STATIC FILES AND HTML TEMPLATES
# ============================================================

app.mount(
    "/static",
    StaticFiles(
        directory=os.path.join(
            PROJECT_ROOT,
            "static"
        )
    ),
    name="static"
)

templates = Jinja2Templates(
    directory=os.path.join(
        PROJECT_ROOT,
        "templates"
    )
)


# ============================================================
# MODEL
# ============================================================

MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "experiments",
    "mobilenetv2_finetuned.keras"
)

print("Loading model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded successfully!")


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
# FIND LAST CONVOLUTIONAL LAYER
# ============================================================

conv_layer = None

# ============================================================
# GRAD-CAM LAYER
# ============================================================

# Fine-tuned MobileNetV2 uses a nested backbone.
# The final convolutional feature layer is inside the
# MobileNetV2 backbone.

backbone = model.get_layer(
    "mobilenetv2_1.00_224"
)

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


print(
    "Last convolution layer:",
    conv_layer.name
)


# ============================================================
# CREATE GRAD-CAM MODEL
# ============================================================

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
    outputs=[
        conv_output,
        x
    ]
)

print(
    "Grad-CAM model created successfully!"
)


# ============================================================
# IMAGE QUALITY CHECK
# ============================================================

def check_image_quality(image):

    if image is None:

        return {
            "status": "Poor",
            "message": "Image could not be read."
        }

    height, width = image.shape[:2]

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
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

    if width < 224 or height < 224:

        issues.append(
            "Low image resolution"
        )

    if brightness < 35:

        issues.append(
            "Image appears too dark"
        )

    if brightness > 225:

        issues.append(
            "Image appears too bright"
        )

    if sharpness < 20:

        issues.append(
            "Image may be blurred"
        )

    if len(issues) == 0:

        return {
            "status": "Acceptable",
            "message": "Image quality appears suitable for prototype screening.",
            "resolution": f"{width} × {height}",
            "brightness": round(brightness, 1),
            "sharpness": round(sharpness, 1),
            "issues": []
        }

    return {
        "status": "Review",
        "message": "Image quality may affect model reliability.",
        "resolution": f"{width} × {height}",
        "brightness": round(brightness, 1),
        "sharpness": round(sharpness, 1),
        "issues": issues
    }


# ============================================================
# GRAD-CAM FUNCTION
# ============================================================

def generate_gradcam(
    image_path,
    heatmap_path,
    overlay_path
):

    # --------------------------------------------------------
    # LOAD ORIGINAL IMAGE
    # --------------------------------------------------------

    original_bgr = cv2.imread(
        image_path
    )

    if original_bgr is None:

        raise ValueError(
            "Could not read uploaded image."
        )

    quality = check_image_quality(
        original_bgr
    )

    original_image = cv2.cvtColor(
        original_bgr,
        cv2.COLOR_BGR2RGB
    )


    # --------------------------------------------------------
    # PREPROCESS
    # --------------------------------------------------------

    processed_image = preprocess_image(
        image_path
    )

    input_tensor = tf.convert_to_tensor(
        processed_image,
        dtype=tf.float32
    )

    input_tensor = tf.expand_dims(
        input_tensor,
        axis=0
    )


    # --------------------------------------------------------
    # PREDICTION + GRADIENTS
    # --------------------------------------------------------

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(
            input_tensor,
            training=False
        )

        prediction_vector = predictions[0]

        predicted_class = tf.argmax(
            prediction_vector
        )

        class_score = prediction_vector[
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


    # --------------------------------------------------------
    # FIVE CLASS PROBABILITIES
    # --------------------------------------------------------

    probabilities = (
        predictions[0]
        .numpy()
        .astype(float)
    )

    # Safety normalization in case the model output
    # is not exactly normalized.

    probability_sum = np.sum(
        probabilities
    )

    if probability_sum > 0:

        probabilities = (
            probabilities /
            probability_sum
        )


    probability_data = []

    for index, name in enumerate(
        class_names
    ):

        probability_data.append(
            {
                "name": name,
                "probability": round(
                    float(
                        probabilities[index]
                    ) * 100,
                    2
                )
            }
        )


    # --------------------------------------------------------
    # GRAD-CAM
    # --------------------------------------------------------

    conv_outputs = conv_outputs[0]
    gradients = gradients[0]

    weights = tf.reduce_mean(
        gradients,
        axis=(0, 1)
    )

    cam = tf.reduce_sum(
        conv_outputs * weights,
        axis=-1
    )

    cam = tf.maximum(
        cam,
        0
    )

    cam = cam.numpy()

    max_cam = np.max(cam)

    if max_cam != 0:

        cam = cam / max_cam


    # --------------------------------------------------------
    # RESIZE HEATMAP
    # --------------------------------------------------------

    heatmap = cv2.resize(
        cam,
        (
            original_image.shape[1],
            original_image.shape[0]
        )
    )

    heatmap_uint8 = np.uint8(
        255 * heatmap
    )


    # --------------------------------------------------------
    # CREATE COLORED HEATMAP
    # --------------------------------------------------------

    heatmap_color = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET
    )


    # --------------------------------------------------------
    # SAVE HEATMAP
    # --------------------------------------------------------

    cv2.imwrite(
        heatmap_path,
        heatmap_color
    )


    # --------------------------------------------------------
    # CREATE OVERLAY
    # --------------------------------------------------------

    original_uint8 = np.uint8(
        original_image
    )

    heatmap_rgb = cv2.cvtColor(
        heatmap_color,
        cv2.COLOR_BGR2RGB
    )

    overlay = cv2.addWeighted(
        original_uint8,
        0.6,
        heatmap_rgb,
        0.4,
        0
    )


    # --------------------------------------------------------
    # SAVE OVERLAY
    # --------------------------------------------------------

    overlay_bgr = cv2.cvtColor(
        overlay,
        cv2.COLOR_RGB2BGR
    )

    cv2.imwrite(
        overlay_path,
        overlay_bgr
    )


    # --------------------------------------------------------
    # PREDICTION
    # --------------------------------------------------------

    prediction_index = int(
        predicted_class.numpy()
    )

    confidence = float(
        probabilities[
            prediction_index
        ]
    )


    # --------------------------------------------------------
    # SCREENING INTERPRETATION
    # --------------------------------------------------------

    prediction_name = class_names[
        prediction_index
    ]

    if prediction_name == "No DR":

        interpretation = (
            "The model output is associated "
            "with the No DR category. "
            "The result should still be reviewed "
            "by a qualified eye-care professional."
        )

    elif prediction_name == "Mild":

        interpretation = (
            "The model output is associated "
            "with Mild diabetic retinopathy. "
            "Further professional evaluation "
            "is recommended."
        )

    elif prediction_name == "Moderate":

        interpretation = (
            "The model output is associated "
            "with Moderate diabetic retinopathy. "
            "Further professional evaluation "
            "is recommended."
        )

    elif prediction_name == "Severe":

        interpretation = (
            "The model output is associated "
            "with Severe diabetic retinopathy. "
            "Prompt professional eye evaluation "
            "is recommended."
        )

    else:

        interpretation = (
            "The model output is associated "
            "with Proliferative diabetic retinopathy. "
            "Prompt professional eye evaluation "
            "is recommended."
        )


    # --------------------------------------------------------
    # RETURN ALL INFORMATION
    # --------------------------------------------------------

    return {
        "prediction": prediction_name,

        "confidence": confidence,

        "probabilities": probability_data,

        "quality": quality,

        "interpretation": interpretation
    }


# ============================================================
# HOME PAGE
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
# HEALTH CHECK
# ============================================================

@app.get("/health")
async def health_check():

    return {
        "status": "healthy",
        "model_loaded": model is not None
    }


# ============================================================
# PREDICTION
# ============================================================
def create_screening_report(
    pdf_path,
    prediction,
    confidence,
    probabilities,
    quality,
    interpretation,
    original_image,
    heatmap_image,
    result_image
):
    """
    Create a PDF screening report for the RetinaAI prototype.
    """

    c = canvas.Canvas(pdf_path, pagesize=A4)

    page_width, page_height = A4

    # ---------------------------------------------------------
    # TITLE
    # ---------------------------------------------------------

    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, page_height - 50, "RetinaAI Screening Report")

    c.setFont("Helvetica", 10)
    c.drawString(
        50,
        page_height - 68,
        "AI-Based Diabetic Retinopathy Screening Prototype"
    )

    # ---------------------------------------------------------
    # DATE / TIME
    # ---------------------------------------------------------

    from datetime import datetime

    report_time = datetime.now().strftime(
        "%d-%m-%Y %H:%M:%S"
    )

    c.setFont("Helvetica", 10)
    c.drawString(
        50,
        page_height - 95,
        "Report generated: " + report_time
    )

    # ---------------------------------------------------------
    # RESULT
    # ---------------------------------------------------------

    y = page_height - 135

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Screening Result")

    y -= 25

    c.setFont("Helvetica", 11)

    c.drawString(
        60,
        y,
        "Predicted class: " + str(prediction)
    )

    y -= 20

    c.drawString(
        60,
        y,
        "Model confidence: " + str(confidence) + "%"
    )

    # ---------------------------------------------------------
    # PROBABILITY DISTRIBUTION
    # ---------------------------------------------------------

    y -= 40

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Class Probability Distribution")

    y -= 25

    c.setFont("Helvetica", 10)

    for item in probabilities:

        name = str(item.get("name", "Unknown"))

        probability = float(
            item.get("probability", 0)
        )

        percentage = probability

        c.drawString(
            60,
            y,
            f"{name}: {percentage:.2f}%"
        )

        y -= 18

    # ---------------------------------------------------------
    # IMAGE QUALITY
    # ---------------------------------------------------------

    y -= 15

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Image Quality Assessment")

    y -= 25

    c.setFont("Helvetica", 10)

    c.drawString(
        60,
        y,
        "Status: " +
        str(quality.get("status", "Unknown"))
    )

    y -= 18

    c.drawString(
        60,
        y,
        "Resolution: " +
        str(quality.get("resolution", "Unknown"))
    )

    y -= 18

    c.drawString(
        60,
        y,
        "Brightness: " +
        str(quality.get("brightness", "Unknown"))
    )

    y -= 18

    c.drawString(
        60,
        y,
        "Sharpness: " +
        str(quality.get("sharpness", "Unknown"))
    )

    # ---------------------------------------------------------
    # INTERPRETATION
    # ---------------------------------------------------------

    y -= 35

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "AI Interpretation")

    y -= 25

    c.setFont("Helvetica", 10)

    interpretation_text = str(interpretation)

    # Wrap long interpretation text
    words = interpretation_text.split()

    line = ""

    for word in words:

        test_line = line + word + " "

        if c.stringWidth(test_line, "Helvetica", 10) < 480:

            line = test_line

        else:

            c.drawString(
                60,
                y,
                line
            )

            y -= 15

            line = word + " "

    if line:
        c.drawString(
            60,
            y,
            line
        )

    # ---------------------------------------------------------
    # ORIGINAL RETINAL IMAGE
    # ---------------------------------------------------------

    y -= 35

    c.setFont("Helvetica-Bold", 14)
    c.drawString(
        50,
        y,
        "Original Retinal Image"
    )

    y -= 15

    try:

        c.drawImage(
            ImageReader(original_image),
            60,
            y - 180,
            width=180,
            height=180,
            preserveAspectRatio=True,
            anchor='c'
        )

    except Exception:
        pass

    # ---------------------------------------------------------
    # GRAD-CAM IMAGE
    # ---------------------------------------------------------

    try:

        c.drawImage(
            ImageReader(result_image),
            280,
            y - 180,
            width=220,
            height=180,
            preserveAspectRatio=True,
            anchor='c'
        )

    except Exception:
        pass

    # ---------------------------------------------------------
    # FOOTER / MEDICAL NOTICE
    # ---------------------------------------------------------

    c.setFont("Helvetica-Bold", 10)

    c.drawString(
        50,
        55,
        "Important Notice"
    )

    c.setFont("Helvetica", 8)

    notice = (
        "This report is generated by an academic AI screening prototype. "
        "It is not a medical diagnosis. Results should be reviewed by "
        "a qualified eye-care professional."
    )

    # Wrap notice
    words = notice.split()

    line = ""
    notice_y = 42

    for word in words:

        test_line = line + word + " "

        if c.stringWidth(test_line, "Helvetica", 8) < 500:

            line = test_line

        else:

            c.drawString(
                50,
                notice_y,
                line
            )

            notice_y -= 10

            line = word + " "

    if line:

        c.drawString(
            50,
            notice_y,
            line
        )

    # ---------------------------------------------------------
    # SAVE PDF
    # ---------------------------------------------------------

    c.save()


# ============================================================
# DOWNLOAD SCREENING REPORT
# ============================================================

@app.get("/download-report/{report_filename}")
async def download_report(report_filename: str):

    # Basic filename protection: only allow generated PDF names.
    if not report_filename.endswith("_screening_report.pdf"):
        return HTMLResponse(
            content="Invalid report file.",
            status_code=400
        )

    pdf_path = os.path.join(
        RESULT_FOLDER,
        os.path.basename(report_filename)
    )

    if not os.path.isfile(pdf_path):
        return HTMLResponse(
            content="Report not found. Please run a screening first.",
            status_code=404
        )

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="RetinaAI_Screening_Report.pdf"
    )


@app.post(
    "/predict",
    response_class=HTMLResponse
)
async def predict(
    request: Request,
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    allowed_extensions = [
        ".jpg",
        ".jpeg",
        ".png"
    ]

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed_extensions:

        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context={
                "request": request,
                "error":
                    "Please upload a JPG, JPEG, or PNG image."
            }
        )


    # --------------------------------------------------------
    # UNIQUE FILE NAME
    # --------------------------------------------------------

    unique_id = str(
        uuid.uuid4()
    )

    filename = (
        unique_id +
        extension
    )

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )


    heatmap_filename = (
        unique_id +
        "_heatmap.jpg"
    )

    overlay_filename = (
        unique_id +
        "_gradcam.jpg"
    )


    heatmap_path = os.path.join(
        RESULT_FOLDER,
        heatmap_filename
    )

    overlay_path = os.path.join(
        RESULT_FOLDER,
        overlay_filename
    )


    # --------------------------------------------------------
    # SAVE UPLOADED IMAGE
    # --------------------------------------------------------

    contents = await file.read()

    with open(
        upload_path,
        "wb"
    ) as f:

        f.write(contents)


    # --------------------------------------------------------
    # GENERATE ANALYSIS
    # --------------------------------------------------------

    try:

        result = generate_gradcam(
            upload_path,
            heatmap_path,
            overlay_path
        )

        # --------------------------------------------------------
        # CREATE SCREENING PDF REPORT
        # --------------------------------------------------------

        report_filename = unique_id + "_screening_report.pdf"

        report_path = os.path.join(
            RESULT_FOLDER,
            report_filename
        )

        create_screening_report(
            pdf_path=report_path,
            prediction=result["prediction"],
            confidence=round(
                result["confidence"] * 100,
                2
            ),
            probabilities=result["probabilities"],
            quality=result["quality"],
            interpretation=result["interpretation"],
            original_image=upload_path,
            heatmap_image=heatmap_path,
            result_image=overlay_path
        )

    except Exception as e:

        print(
            "Prediction error:",
            e
        )

        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context={
                "request": request,
                "error":
                    "Could not process the image."
            }
        )


    # --------------------------------------------------------
    # RESULT PAGE
    # --------------------------------------------------------

    return templates.TemplateResponse(
        request=request,
        name="result.html",
        context={

            "request": request,

            "prediction":
                result["prediction"],

            "confidence":
                round(
                    result["confidence"] * 100,
                    2
                ),

            "probabilities":
                result["probabilities"],

            "quality":
                result["quality"],

            "interpretation":
                result["interpretation"],

            "original_image":
                "/static/uploads/" +
                filename,

            "heatmap_image":
                "/static/results/" +
                heatmap_filename,

            "result_image":
                "/static/results/" +
                overlay_filename,

            "report_url":
                "/download-report/" +
                report_filename
        }
    )