import os
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay

# ============================================================
# PATHS
# ============================================================

CONFUSION_MATRIX_PATH = r"evaluation\balanced_confusion_matrix.csv"
CLASSIFICATION_REPORT_PATH = r"evaluation\balanced_classification_report.csv"

CONFUSION_MATRIX_IMAGE = r"evaluation\balanced_confusion_matrix.png"
PERFORMANCE_IMAGE = r"evaluation\balanced_class_performance.png"

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
# CREATE CONFUSION MATRIX GRAPH
# ============================================================

print("\nLoading confusion matrix...")

cm_df = pd.read_csv(
    CONFUSION_MATRIX_PATH,
    index_col=0
)

cm = cm_df.values

fig, ax = plt.subplots(figsize=(9, 7))

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=CLASS_NAMES
)

display.plot(
    ax=ax,
    values_format="d",
    cmap="Blues",
    colorbar=True
)

ax.set_title(
    "Balanced CNN - Confusion Matrix",
    fontsize=15
)

ax.set_xlabel("Predicted Class")
ax.set_ylabel("Actual Class")

plt.xticks(rotation=20)
plt.tight_layout()

plt.savefig(
    CONFUSION_MATRIX_IMAGE,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print(
    f"Saved: {CONFUSION_MATRIX_IMAGE}"
)

# ============================================================
# CREATE PRECISION / RECALL / F1 GRAPH
# ============================================================

print("\nLoading classification report...")

report_df = pd.read_csv(
    CLASSIFICATION_REPORT_PATH,
    index_col=0
)

# Keep only the five actual disease classes
performance_df = report_df.loc[
    CLASS_NAMES,
    ["precision", "recall", "f1-score"]
]

ax = performance_df.plot(
    kind="bar",
    figsize=(11, 7)
)

ax.set_title(
    "Balanced CNN - Class-wise Performance",
    fontsize=15
)

ax.set_xlabel("Diabetic Retinopathy Class")
ax.set_ylabel("Score")

ax.set_ylim(0, 1)

ax.legend(
    title="Metric"
)

plt.xticks(
    rotation=20,
    ha="right"
)

plt.tight_layout()

plt.savefig(
    PERFORMANCE_IMAGE,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print(
    f"Saved: {PERFORMANCE_IMAGE}"
)

# ============================================================
# FINISHED
# ============================================================

print("\n==========================================")
print("EVALUATION GRAPHS CREATED SUCCESSFULLY")
print("==========================================")

print(
    f"\n1. {CONFUSION_MATRIX_IMAGE}"
)

print(
    f"2. {PERFORMANCE_IMAGE}"
)