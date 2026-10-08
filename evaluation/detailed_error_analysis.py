import pandas as pd


# ============================================================
# FILE PATHS
# ============================================================

CNN_PREDICTIONS = r"evaluation\balanced_test_predictions.csv"
MOBILE_PREDICTIONS = r"evaluation\mobilenetv2_test_predictions.csv"

CNN_OUTPUT = r"evaluation\balanced_cnn_error_analysis.csv"
MOBILE_OUTPUT = r"evaluation\mobilenetv2_error_analysis.csv"

CNN_PAIRS_OUTPUT = r"evaluation\balanced_cnn_error_pairs.csv"
MOBILE_PAIRS_OUTPUT = r"evaluation\mobilenetv2_error_pairs.csv"


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
# ERROR ANALYSIS FUNCTION
# ============================================================

def analyze_errors(
    prediction_file,
    output_file,
    pairs_output,
    model_name
):

    print("\n" + "=" * 70)
    print(model_name)
    print("=" * 70)

    df = pd.read_csv(prediction_file)

    print("\nColumns found:")
    print(list(df.columns))

    # Convert numeric class labels to class names
    if pd.api.types.is_numeric_dtype(df["actual_class"]):

        label_to_name = {
            0: "No DR",
            1: "Mild",
            2: "Moderate",
            3: "Severe",
            4: "Proliferative"
        }

        df["actual_class"] = df["actual_class"].map(
            label_to_name
        )

        df["predicted_class"] = df["predicted_class"].map(
            label_to_name
        )


    # --------------------------------------------------------
    # CREATE CORRECT COLUMN IF MISSING
    # --------------------------------------------------------

    if "correct" not in df.columns:

        if (
            "actual_label" in df.columns
            and "predicted_label" in df.columns
        ):

            df["correct"] = (
                df["actual_label"]
                == df["predicted_label"]
            )

        elif (
            "actual_class" in df.columns
            and "predicted_class" in df.columns
        ):

            df["correct"] = (
                df["actual_class"]
                == df["predicted_class"]
            )

        else:

            raise ValueError(
                "Could not determine correct predictions. "
                "Required actual/predicted columns are missing."
            )

    # --------------------------------------------------------
    # TOTAL RESULTS
    # --------------------------------------------------------

    total = len(df)

    correct = int(df["correct"].sum())

    incorrect = total - correct

    accuracy = correct / total

    print("\nTotal test images :", total)
    print("Correct           :", correct)
    print("Incorrect         :", incorrect)
    print(f"Accuracy          : {accuracy * 100:.2f}%")


    # --------------------------------------------------------
    # CLASS-WISE ANALYSIS
    # --------------------------------------------------------

    rows = []

    for class_name in CLASS_NAMES:

        class_df = df[
            df["actual_class"] == class_name
        ]

        class_total = len(class_df)

        class_correct = int(
            class_df["correct"].sum()
        )

        class_incorrect = (
            class_total - class_correct
        )

        if class_total > 0:

            recall = (
                class_correct / class_total
            )

            error_rate = (
                class_incorrect / class_total
            )

        else:

            recall = 0
            error_rate = 0

        rows.append({

            "Class": class_name,

            "Total Images":
                class_total,

            "Correct":
                class_correct,

            "Incorrect":
                class_incorrect,

            "Recall":
                recall,

            "Error Rate":
                error_rate
        })


    class_results = pd.DataFrame(rows)


    # --------------------------------------------------------
    # DISPLAY CLASS RESULTS
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("CLASS-WISE ERROR ANALYSIS")
    print("-" * 70)

    print(
        class_results.to_string(
            index=False,
            formatters={
                "Recall":
                    "{:.4f}".format,

                "Error Rate":
                    "{:.4f}".format
            }
        )
    )


    # --------------------------------------------------------
    # SAVE CLASS-WISE ANALYSIS
    # --------------------------------------------------------

    class_results.to_csv(
        output_file,
        index=False
    )

    print("\nSaved:")
    print(output_file)


    # --------------------------------------------------------
    # ERROR PAIRS
    # --------------------------------------------------------

    errors = df[
        df["correct"] == False
    ].copy()

    if len(errors) > 0:

        error_pairs = (
            errors
            .groupby(
                [
                    "actual_class",
                    "predicted_class"
                ]
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

    else:

        error_pairs = pd.DataFrame(
            columns=[
                "actual_class",
                "predicted_class",
                "Error Count"
            ]
        )


    # --------------------------------------------------------
    # DISPLAY ERROR PAIRS
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("MOST COMMON ERROR PAIRS")
    print("-" * 70)

    if len(error_pairs) > 0:

        print(
            error_pairs.to_string(
                index=False
            )
        )

    else:

        print("No errors found.")


    # --------------------------------------------------------
    # SAVE ERROR PAIRS
    # --------------------------------------------------------

    error_pairs.to_csv(
        pairs_output,
        index=False
    )

    print("\nSaved:")
    print(pairs_output)


# ============================================================
# BALANCED CNN
# ============================================================

analyze_errors(
    CNN_PREDICTIONS,
    CNN_OUTPUT,
    CNN_PAIRS_OUTPUT,
    "BALANCED CNN ERROR ANALYSIS"
)


# ============================================================
# MOBILENETV2
# ============================================================

analyze_errors(
    MOBILE_PREDICTIONS,
    MOBILE_OUTPUT,
    MOBILE_PAIRS_OUTPUT,
    "MOBILENETV2 ERROR ANALYSIS"
)


# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 70)
print("DETAILED ERROR ANALYSIS COMPLETED")
print("=" * 70)