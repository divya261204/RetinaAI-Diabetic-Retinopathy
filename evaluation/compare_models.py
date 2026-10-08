import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


# ============================================================
# FILE PATHS
# ============================================================

CNN_REPORT = r"evaluation\balanced_classification_report.csv"
MOBILE_REPORT = r"evaluation\mobilenetv2_classification_report.csv"

CNN_CM = r"evaluation\balanced_confusion_matrix.csv"
MOBILE_CM = r"evaluation\mobilenetv2_confusion_matrix.csv"

OUTPUT_COMPARISON = r"evaluation\model_comparison.csv"
OUTPUT_CHART = r"evaluation\model_accuracy_comparison.png"


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
# LOAD REPORTS
# ============================================================

print("=" * 65)
print("CNN vs MOBILENETV2 MODEL COMPARISON")
print("=" * 65)

cnn_report = pd.read_csv(
    CNN_REPORT,
    index_col=0
)

mobile_report = pd.read_csv(
    MOBILE_REPORT,
    index_col=0
)


# ============================================================
# CREATE COMPARISON TABLE
# ============================================================

rows = []

for class_name in CLASS_NAMES:

    rows.append({
        "Class": class_name,

        "CNN Precision":
            cnn_report.loc[class_name, "precision"],

        "MobileNetV2 Precision":
            mobile_report.loc[class_name, "precision"],

        "CNN Recall":
            cnn_report.loc[class_name, "recall"],

        "MobileNetV2 Recall":
            mobile_report.loc[class_name, "recall"],

        "CNN F1":
            cnn_report.loc[class_name, "f1-score"],

        "MobileNetV2 F1":
            mobile_report.loc[class_name, "f1-score"]
    })


comparison_df = pd.DataFrame(rows)


# ============================================================
# ADD OVERALL METRICS
# ============================================================

cnn_accuracy = cnn_report.loc["accuracy", "precision"]
mobile_accuracy = mobile_report.loc["accuracy", "precision"]

cnn_macro_f1 = cnn_report.loc["macro avg", "f1-score"]
mobile_macro_f1 = mobile_report.loc["macro avg", "f1-score"]

cnn_macro_precision = cnn_report.loc["macro avg", "precision"]
mobile_macro_precision = mobile_report.loc["macro avg", "precision"]

cnn_macro_recall = cnn_report.loc["macro avg", "recall"]
mobile_macro_recall = mobile_report.loc["macro avg", "recall"]


overall_df = pd.DataFrame([
    {
        "Metric": "Accuracy",
        "Balanced CNN": cnn_accuracy,
        "MobileNetV2": mobile_accuracy
    },
    {
        "Metric": "Macro Precision",
        "Balanced CNN": cnn_macro_precision,
        "MobileNetV2": mobile_macro_precision
    },
    {
        "Metric": "Macro Recall",
        "Balanced CNN": cnn_macro_recall,
        "MobileNetV2": mobile_macro_recall
    },
    {
        "Metric": "Macro F1",
        "Balanced CNN": cnn_macro_f1,
        "MobileNetV2": mobile_macro_f1
    }
])


# ============================================================
# PRINT OVERALL COMPARISON
# ============================================================

print("\n" + "=" * 65)
print("OVERALL MODEL COMPARISON")
print("=" * 65)

print(
    overall_df.to_string(
        index=False,
        formatters={
            "Balanced CNN": "{:.4f}".format,
            "MobileNetV2": "{:.4f}".format
        }
    )
)


# ============================================================
# PRINT CLASS-WISE COMPARISON
# ============================================================

print("\n" + "=" * 65)
print("CLASS-WISE COMPARISON")
print("=" * 65)

print(
    comparison_df.to_string(
        index=False,
        formatters={
            "CNN Precision": "{:.4f}".format,
            "MobileNetV2 Precision": "{:.4f}".format,
            "CNN Recall": "{:.4f}".format,
            "MobileNetV2 Recall": "{:.4f}".format,
            "CNN F1": "{:.4f}".format,
            "MobileNetV2 F1": "{:.4f}".format
        }
    )
)


# ============================================================
# SAVE COMPARISON
# ============================================================

comparison_df.to_csv(
    OUTPUT_COMPARISON,
    index=False
)

print("\nSaved:")
print(OUTPUT_COMPARISON)


# ============================================================
# CREATE ACCURACY COMPARISON CHART
# ============================================================

models = [
    "Balanced CNN",
    "MobileNetV2"
]

accuracies = [
    cnn_accuracy * 100,
    mobile_accuracy * 100
]

plt.figure(figsize=(8, 5))

bars = plt.bar(
    models,
    accuracies
)

plt.ylabel("Test Accuracy (%)")
plt.title("Model Accuracy Comparison")
plt.ylim(0, 100)

for bar, value in zip(bars, accuracies):

    plt.text(
        bar.get_x() + bar.get_width() / 2,
        value + 2,
        f"{value:.2f}%",
        ha="center"
    )

plt.tight_layout()

plt.savefig(
    OUTPUT_CHART,
    dpi=300
)

plt.close()

print("Saved:")
print(OUTPUT_CHART)


# ============================================================
# FINAL SUMMARY
# ============================================================

print("\n" + "=" * 65)
print("MODEL COMPARISON COMPLETED")
print("=" * 65)

print(f"Balanced CNN Accuracy : {cnn_accuracy * 100:.2f}%")
print(f"MobileNetV2 Accuracy  : {mobile_accuracy * 100:.2f}%")

print("\nEvaluation files are ready for the major project.")