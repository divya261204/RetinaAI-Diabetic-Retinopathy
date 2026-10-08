import pandas as pd
import matplotlib.pyplot as plt

print("=" * 70)
print("CLASS-WISE MODEL PERFORMANCE COMPARISON")
print("=" * 70)

# ============================================================
# LOAD CLASSIFICATION REPORTS
# ============================================================

cnn_path = r"evaluation\balanced_classification_report.csv"

finetuned_path = (
    r"evaluation\finetuned_mobilenetv2_classification_report.csv"
)

cnn = pd.read_csv(cnn_path, index_col=0)
finetuned = pd.read_csv(finetuned_path, index_col=0)

classes = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]

# ============================================================
# CREATE COMPARISON TABLE
# ============================================================

comparison = pd.DataFrame({
    "Class": classes,

    "CNN Precision": [
        cnn.loc[c, "precision"] for c in classes
    ],

    "Fine-tuned Precision": [
        finetuned.loc[c, "precision"] for c in classes
    ],

    "CNN Recall": [
        cnn.loc[c, "recall"] for c in classes
    ],

    "Fine-tuned Recall": [
        finetuned.loc[c, "recall"] for c in classes
    ],

    "CNN F1": [
        cnn.loc[c, "f1-score"] for c in classes
    ],

    "Fine-tuned F1": [
        finetuned.loc[c, "f1-score"] for c in classes
    ]
})

# ============================================================
# DISPLAY
# ============================================================

print("\nCLASS-WISE COMPARISON")
print("-" * 70)

display_df = comparison.copy()

for column in display_df.columns[1:]:

    display_df[column] = (
        display_df[column] * 100
    ).round(2).astype(str) + "%"

print(display_df.to_string(index=False))

# ============================================================
# SAVE CSV
# ============================================================

output_csv = (
    r"evaluation\class_performance_comparison.csv"
)

comparison.to_csv(
    output_csv,
    index=False
)

print("\nSaved:")
print(output_csv)

# ============================================================
# RECALL COMPARISON
# ============================================================

plt.figure(figsize=(11, 6))

x = range(len(classes))
width = 0.35

plt.bar(
    [i - width / 2 for i in x],
    comparison["CNN Recall"] * 100,
    width,
    label="Balanced CNN"
)

plt.bar(
    [i + width / 2 for i in x],
    comparison["Fine-tuned Recall"] * 100,
    width,
    label="Fine-tuned MobileNetV2"
)

plt.title("Class-wise Recall Comparison")

plt.xlabel("Diabetic Retinopathy Class")

plt.ylabel("Recall (%)")

plt.xticks(
    x,
    classes,
    rotation=15,
    ha="right"
)

plt.ylim(0, 100)

plt.legend()

plt.tight_layout()

recall_path = (
    r"evaluation\class_recall_comparison.png"
)

plt.savefig(
    recall_path,
    dpi=300
)

plt.close()

print(recall_path)

# ============================================================
# F1-SCORE COMPARISON
# ============================================================

plt.figure(figsize=(11, 6))

plt.bar(
    [i - width / 2 for i in x],
    comparison["CNN F1"] * 100,
    width,
    label="Balanced CNN"
)

plt.bar(
    [i + width / 2 for i in x],
    comparison["Fine-tuned F1"] * 100,
    width,
    label="Fine-tuned MobileNetV2"
)

plt.title("Class-wise F1-Score Comparison")

plt.xlabel("Diabetic Retinopathy Class")

plt.ylabel("F1-Score (%)")

plt.xticks(
    x,
    classes,
    rotation=15,
    ha="right"
)

plt.ylim(0, 100)

plt.legend()

plt.tight_layout()

f1_path = (
    r"evaluation\class_f1_comparison.png"
)

plt.savefig(
    f1_path,
    dpi=300
)

plt.close()

print(f1_path)

# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 70)
print("CLASS-WISE COMPARISON COMPLETED")
print("=" * 70)