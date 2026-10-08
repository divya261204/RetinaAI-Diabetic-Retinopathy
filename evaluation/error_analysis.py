import pandas as pd
import numpy as np

# ============================================================
# PATH
# ============================================================

PREDICTIONS_PATH = r"evaluation\balanced_test_predictions.csv"

# ============================================================
# LOAD PREDICTIONS
# ============================================================

print("\nLoading test predictions...")

df = pd.read_csv(PREDICTIONS_PATH)

CLASS_NAMES = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative"
]

# ============================================================
# CORRECT / INCORRECT
# ============================================================

df["correct"] = (
    df["actual_class"] ==
    df["predicted_class"]
)

correct_count = df["correct"].sum()
incorrect_count = len(df) - correct_count

print("\n==========================================")
print("OVERALL ERROR ANALYSIS")
print("==========================================")

print(f"Total test images : {len(df)}")
print(f"Correct           : {correct_count}")
print(f"Incorrect         : {incorrect_count}")

print(
    f"Accuracy          : "
    f"{correct_count / len(df) * 100:.2f}%"
)

# ============================================================
# CLASS-WISE COUNTS
# ============================================================

print("\n==========================================")
print("CLASS-WISE RESULTS")
print("==========================================")

for class_id, class_name in enumerate(CLASS_NAMES):

    class_data = df[
        df["actual_class"] == class_id
    ]

    total = len(class_data)

    correct = class_data["correct"].sum()

    incorrect = total - correct

    recall = (
        correct / total * 100
        if total > 0
        else 0
    )

    print(
        f"\n{class_name}"
    )

    print(
        f"  Total images : {total}"
    )

    print(
        f"  Correct      : {correct}"
    )

    print(
        f"  Incorrect    : {incorrect}"
    )

    print(
        f"  Recall       : {recall:.2f}%"
    )

# ============================================================
# WRONG PREDICTION PAIRS
# ============================================================

wrong = df[
    df["actual_class"] !=
    df["predicted_class"]
].copy()

wrong["actual_label"] = wrong[
    "actual_class"
].map(dict(enumerate(CLASS_NAMES)))

wrong["predicted_label"] = wrong[
    "predicted_class"
].map(dict(enumerate(CLASS_NAMES)))

pair_counts = (
    wrong.groupby(
        ["actual_label", "predicted_label"]
    )
    .size()
    .sort_values(
        ascending=False
    )
)

print("\n==========================================")
print("MOST COMMON WRONG PREDICTIONS")
print("==========================================")

for (actual, predicted), count in pair_counts.items():

    print(
        f"{actual} -> {predicted} : {count}"
    )

# ============================================================
# SEVERE ANALYSIS
# ============================================================

print("\n==========================================")
print("SEVERE CLASS ANALYSIS")
print("==========================================")

severe = df[
    df["actual_class"] == 3
]

print(
    severe[
        "predicted_label"
    ].value_counts()
)

# ============================================================
# PROLIFERATIVE ANALYSIS
# ============================================================

print("\n==========================================")
print("PROLIFERATIVE CLASS ANALYSIS")
print("==========================================")

proliferative = df[
    df["actual_class"] == 4
]

print(
    proliferative[
        "predicted_label"
    ].value_counts()
)

# ============================================================
# SAVE ERROR ANALYSIS
# ============================================================

wrong.to_csv(
    r"evaluation\balanced_wrong_predictions.csv",
    index=False
)

print("\n==========================================")
print("ERROR ANALYSIS COMPLETED")
print("==========================================")

print(
    "Saved: evaluation\\balanced_wrong_predictions.csv"
)