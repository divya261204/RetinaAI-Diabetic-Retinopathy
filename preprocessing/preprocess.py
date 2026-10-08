import cv2
import numpy as np


def preprocess_image(image):
    """
    Preprocess an already-loaded retinal image.

    Input:
        image -> NumPy image array in BGR format

    Output:
        NumPy array of shape (224, 224, 3)
        with float32 values between 0 and 1
    """

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------
    if image is None:
        raise ValueError("Input image is empty.")

    if not isinstance(image, np.ndarray):
        raise TypeError(
            f"Expected NumPy image array, got {type(image)}"
        )

    # --------------------------------------------------------
    # Convert BGR to RGB
    # --------------------------------------------------------
    image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    # --------------------------------------------------------
    # Resize to 224 x 224
    # --------------------------------------------------------
    image = cv2.resize(
        image,
        (224, 224),
        interpolation=cv2.INTER_AREA
    )

    # --------------------------------------------------------
    # Convert RGB to LAB
    # --------------------------------------------------------
    lab = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2LAB
    )

    # --------------------------------------------------------
    # Split LAB channels
    # --------------------------------------------------------
    l_channel, a_channel, b_channel = cv2.split(lab)

    # --------------------------------------------------------
    # Apply CLAHE
    # --------------------------------------------------------
    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    l_channel = clahe.apply(l_channel)

    # --------------------------------------------------------
    # Merge LAB channels
    # --------------------------------------------------------
    lab = cv2.merge(
        (l_channel, a_channel, b_channel)
    )

    # --------------------------------------------------------
    # Convert LAB back to RGB
    # --------------------------------------------------------
    image = cv2.cvtColor(
        lab,
        cv2.COLOR_LAB2RGB
    )

    # --------------------------------------------------------
    # Gaussian smoothing
    # --------------------------------------------------------
    image = cv2.GaussianBlur(
        image,
        (3, 3),
        0
    )

    # --------------------------------------------------------
    # Normalize 0-255 -> 0-1
    # --------------------------------------------------------
    image = image.astype(
        np.float32
    ) / 255.0

    # --------------------------------------------------------
    # Final validation
    # --------------------------------------------------------
    if image.shape != (224, 224, 3):
        raise ValueError(
            f"Unexpected image shape: {image.shape}"
        )

    return image