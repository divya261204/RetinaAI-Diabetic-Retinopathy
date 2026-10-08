import pandas as pd
import matplotlib.pyplot as plt


# ============================================================
# FILE PATHS
# ============================================================

CNN_CM = r"evaluation\balanced_confusion_matrix.csv"
MOBILE_CM = r"evaluation\mobilenetv2_confusion_matrix.csv"

CNN_OUTPUT = r"evaluation\balanced_cnn_confusion_matrix_visual.png"
MOBILE_OUTPUT = r"evaluation\mobilenetv2_confusion_matrix_visual.png"


# ============================================================
# CLASS NAMES
# ============================================================

CLASS_NAMES = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]


# ============================================================
# FUNCTION TO PLOT CONFUSION MATRIX
# ============================================================

def plot_matrix(
    file_path,
    output_path,
    title
):

    cm = pd.read_csv(
        file_path,
        index_col=0
    )

    matrix = cm.values

    plt.figure(figsize=(8, 7))

    plt.imshow(
        matrix,
        interpolation="nearest"
    )

    plt.title(title)
    plt.colorbar()

    tick_marks = range(len(CLASS_NAMES))

    plt.xticks(
        tick_marks,
        CLASS_NAMES,
        rotation=45,
        ha="right"
    )

    plt.yticks(
        tick_marks,
        CLASS_NAMES
    )

    plt.xlabel("Predicted Class")
    plt.ylabel("Actual Class")

    # Add values inside cells
    for i in range(matrix.shape[0]):

        for j in range(matrix.shape[1]):

            plt.text(
                j,
                i,
                str(matrix[i, j]),
                ha="center",
                va="center"
            )

    plt.tight_layout()

    plt.savefig(
        output_path,
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()

    print("Saved:")
    print(output_path)


# ============================================================
# MAIN
# ============================================================

print("=" * 60)
print("CONFUSION MATRIX VISUALIZATION")
print("=" * 60)

print("\nGenerating Balanced CNN confusion matrix...")

plot_matrix(
    CNN_CM,
    CNN_OUTPUT,
    "Balanced CNN - Confusion Matrix"
)

print("\nGenerating MobileNetV2 confusion matrix...")

plot_matrix(
    MOBILE_CM,
    MOBILE_OUTPUT,
    "MobileNetV2 - Confusion Matrix"
)

print("\n" + "=" * 60)
print("CONFUSION MATRIX VISUALIZATION COMPLETED")
print("=" * 60)