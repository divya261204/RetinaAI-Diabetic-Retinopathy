import pandas as pd

print("=" * 70)
print("FINE-TUNED MOBILENETV2 ERROR ANALYSIS")
print("=" * 70)

# ============================================================
# FILE PATH
# ============================================================

INPUT_PATH = (
    r"evaluation\finetuned_mobilenetv2_test_predictions.csv"
)

# ============================================================
# LOAD PREDICTIONS
# ============================================================

df = pd.read_csv(INPUT_PATH)

print("\nColumns found:")
print(list(df.columns))

# ============================================================
# CALCULATE CORRECT / INCORRECT
# ============================================================

df["correct"] = (
    df["actual_class"] == df["predicted_class"]
)

total_images = len(df)
correct = int(df["correct"].sum())
incorrect = total_images - correct

accuracy = correct / total_images

print("\n" + "=" * 70)
print("OVERALL ERROR ANALYSIS")
print("=" * 70)

print(f"Total test images : {total_images}")
print(f"Correct           : {correct}")
print(f"Incorrect         : {incorrect}")
print(f"Accuracy          : {accuracy * 100:.2f}%")

# ============================================================
# CLASS NAMES
# ============================================================

label_to_name = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative"
}

# ============================================================
# CLASS-WISE ERROR ANALYSIS
# ============================================================

class_results = []

for class_id in range(5):

    class_name = label_to_name[class_id]

    class_df = df[
        df["actual_class"] == class_id
    ]

    total = len(class_df)

    class_correct = int(
        class_df["correct"].sum()
    )

    class_incorrect = total - class_correct

    recall = (
        class_correct / total
        if total > 0
        else 0
    )

    error_rate = (
        class_incorrect / total
        if total > 0
        else 0
    )

    class_results.append({
        "Class": class_name,
        "Total Images": total,
        "Correct": class_correct,
        "Incorrect": class_incorrect,
        "Recall": recall,
        "Error Rate": error_rate
    })

class_results_df = pd.DataFrame(
    class_results
)

print("\n" + "-" * 70)
print("CLASS-WISE RESULTS")
print("-" * 70)

display_df = class_results_df.copy()

display_df["Recall"] = (
    display_df["Recall"] * 100
).round(2)

display_df["Error Rate"] = (
    display_df["Error Rate"] * 100
).round(2)

print(
    display_df.to_string(index=False)
)

# ============================================================
# SAVE CLASS-WISE RESULTS
# ============================================================

class_output = (
    r"evaluation\finetuned_mobilenetv2_error_analysis.csv"
)

class_results_df.to_csv(
    class_output,
    index=False
)

# ============================================================
# WRONG PREDICTION PAIRS
# ============================================================

wrong_df = df[
    df["actual_class"] != df["predicted_class"]
].copy()

wrong_df["actual_label"] = (
    wrong_df["actual_class"]
    .map(label_to_name)
)

wrong_df["predicted_label"] = (
    wrong_df["predicted_class"]
    .map(label_to_name)
)

error_pairs = (
    wrong_df
    .groupby(
        ["actual_label", "predicted_label"]
    )
    .size()
    .reset_index(
        name="Error Count"
    )
    .sort_values(
        "Error Count",
        ascending=False
    )
)

print("\n" + "-" * 70)
print("MOST COMMON ERROR PAIRS")
print("-" * 70)

print(
    error_pairs.to_string(index=False)
)

# ============================================================
# SAVE ERROR PAIRS
# ============================================================

pairs_output = (
    r"evaluation\finetuned_mobilenetv2_error_pairs.csv"
)

error_pairs.to_csv(
    pairs_output,
    index=False
)

# ============================================================
# MOST COMMON ERRORS
# ============================================================

print("\n" + "-" * 70)
print("TOP 10 ERROR PATTERNS")
print("-" * 70)

top_errors = error_pairs.head(10)

for _, row in top_errors.iterrows():

    print(
        f"{row['actual_label']:15s} -> "
        f"{row['predicted_label']:15s} : "
        f"{row['Error Count']}"
    )

# ============================================================
# CLASS-SPECIFIC ERROR SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("ERROR SUMMARY BY ACTUAL CLASS")
print("=" * 70)

for class_id in range(5):

    class_name = label_to_name[class_id]

    class_errors = wrong_df[
        wrong_df["actual_class"] == class_id
    ]

    print(f"\n{class_name}:")

    if len(class_errors) == 0:

        print("  No incorrect predictions")

        continue

    prediction_counts = (
        class_errors["predicted_label"]
        .value_counts()
    )

    for predicted_label, count in prediction_counts.items():

        print(
            f"  Predicted as {predicted_label}: "
            f"{count}"
        )

# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 70)
print("FINE-TUNED ERROR ANALYSIS COMPLETED")
print("=" * 70)

print("\nSaved files:")
print(class_output)
print(pairs_output)

print("=" * 70)