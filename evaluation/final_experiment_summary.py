import pandas as pd
import os

print("=" * 80)
print("FINAL EXPERIMENT SUMMARY")
print("=" * 80)

# ---------------------------------------------------------
# FILE PATHS
# ---------------------------------------------------------

files = {
    "Balanced CNN": "evaluation/balanced_classification_report.csv",
    "MobileNetV2": "evaluation/mobilenetv2_classification_report.csv",
    "Fine-tuned MobileNetV2": "evaluation/finetuned_mobilenetv2_classification_report.csv"
}

# ---------------------------------------------------------
# MODEL ACCURACIES
# ---------------------------------------------------------

accuracies = {
    "Balanced CNN": 65.09,
    "MobileNetV2": 55.09,
    "Fine-tuned MobileNetV2": 70.36
}

# ---------------------------------------------------------
# BEST VALIDATION ACCURACY
# ---------------------------------------------------------

validation_info = {
    "Balanced CNN": {
        "best_val_accuracy": 61.20,
        "epoch": 14
    },
    "MobileNetV2": {
        "best_val_accuracy": 61.02,
        "epoch": 2
    },
    "Fine-tuned MobileNetV2": {
        "best_val_accuracy": 62.30,
        "epoch": 15
    }
}

# ---------------------------------------------------------
# READ CLASSIFICATION REPORTS
# ---------------------------------------------------------

results = []

for model_name, file_path in files.items():

    if not os.path.exists(file_path):
        print(f"\nWARNING: File not found: {file_path}")
        continue

    df = pd.read_csv(file_path)

    # Find macro average row
    macro_row = df[df.iloc[:, 0].astype(str).str.lower().str.contains("macro")]

    if len(macro_row) == 0:
        print(f"\nWARNING: Macro average not found in {file_path}")
        continue

    row = macro_row.iloc[0]

    precision = float(row["precision"]) * 100
    recall = float(row["recall"]) * 100
    f1 = float(row["f1-score"]) * 100

    results.append({
        "Model": model_name,
        "Test Accuracy (%)": accuracies[model_name],
        "Macro Precision (%)": round(precision, 2),
        "Macro Recall (%)": round(recall, 2),
        "Macro F1 (%)": round(f1, 2),
        "Best Val Accuracy (%)": validation_info[model_name]["best_val_accuracy"],
        "Best Epoch": validation_info[model_name]["epoch"]
    })

# ---------------------------------------------------------
# CREATE FINAL TABLE
# ---------------------------------------------------------

summary = pd.DataFrame(results)

print("\n")
print("-" * 110)
print("MODEL PERFORMANCE COMPARISON")
print("-" * 110)

print(summary.to_string(index=False))

# ---------------------------------------------------------
# IMPROVEMENT
# ---------------------------------------------------------

if "Fine-tuned MobileNetV2" in summary["Model"].values:

    ft_accuracy = summary.loc[
        summary["Model"] == "Fine-tuned MobileNetV2",
        "Test Accuracy (%)"
    ].iloc[0]

    cnn_accuracy = summary.loc[
        summary["Model"] == "Balanced CNN",
        "Test Accuracy (%)"
    ].iloc[0]

    mn_accuracy = summary.loc[
        summary["Model"] == "MobileNetV2",
        "Test Accuracy (%)"
    ].iloc[0]

    print("\n")
    print("-" * 80)
    print("IMPROVEMENT ANALYSIS")
    print("-" * 80)

    print(
        f"Fine-tuned MobileNetV2 vs Balanced CNN : "
        f"+{ft_accuracy - cnn_accuracy:.2f} percentage points"
    )

    print(
        f"Fine-tuned MobileNetV2 vs MobileNetV2 : "
        f"+{ft_accuracy - mn_accuracy:.2f} percentage points"
    )

# ---------------------------------------------------------
# DATASET INFORMATION
# ---------------------------------------------------------

print("\n")
print("=" * 80)
print("DATASET INFORMATION")
print("=" * 80)

print("Total images       : 3662")
print("Training images    : 2563")
print("Validation images  : 549")
print("Test images        : 550")
print("Number of classes  : 5")

print("\nClasses:")
print("0 - No DR")
print("1 - Mild")
print("2 - Moderate")
print("3 - Severe")
print("4 - Proliferative")

# ---------------------------------------------------------
# SAVE CSV
# ---------------------------------------------------------

output_file = "evaluation/final_experiment_summary.csv"

summary.to_csv(output_file, index=False)

print("\n")
print("=" * 80)
print(f"FINAL SUMMARY SAVED TO:")
print(output_file)
print("=" * 80)