import pandas as pd
import matplotlib.pyplot as plt

print("=" * 70)
print("FINE-TUNED MOBILENETV2 CONFUSION MATRIX")
print("=" * 70)

# ============================================================
# LOAD CONFUSION MATRIX
# ============================================================

input_path = (
    r"evaluation\finetuned_mobilenetv2_confusion_matrix.csv"
)

cm = pd.read_csv(
    input_path,
    index_col=0
)

print("\nConfusion matrix:")
print(cm)

# ============================================================
# PLOT
# ============================================================

plt.figure(figsize=(9, 7))

plt.imshow(
    cm.values,
    interpolation="nearest"
)

plt.title(
    "Fine-tuned MobileNetV2 Confusion Matrix"
)

plt.xlabel(
    "Predicted Class"
)

plt.ylabel(
    "Actual Class"
)

classes = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]

plt.xticks(
    range(len(classes)),
    classes,
    rotation=30,
    ha="right"
)

plt.yticks(
    range(len(classes)),
    classes
)

# ============================================================
# ADD VALUES TO CELLS
# ============================================================

for i in range(len(classes)):

    for j in range(len(classes)):

        plt.text(
            j,
            i,
            str(cm.iloc[i, j]),
            ha="center",
            va="center"
        )

plt.colorbar()

plt.tight_layout()

# ============================================================
# SAVE
# ============================================================

output_path = (
    r"evaluation\finetuned_mobilenetv2_confusion_matrix_visual.png"
)

plt.savefig(
    output_path,
    dpi=300
)

plt.close()

print("\nSaved:")
print(output_path)

print("\n" + "=" * 70)
print("CONFUSION MATRIX VISUALIZATION COMPLETED")
print("=" * 70)