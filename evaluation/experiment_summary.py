import pandas as pd


# ============================================================
# EXPERIMENT SUMMARY
# ============================================================

print("=" * 70)
print("CREATING EXPERIMENT SUMMARY")
print("=" * 70)


# ============================================================
# MODEL RESULTS
# ============================================================

results = [

    {
        "Model": "Balanced CNN",
        "Test Images": 550,
        "Test Accuracy": 0.6509,
        "Test Loss": 0.9391,
        "Macro Precision": 0.3389,
        "Macro Recall": 0.4050,
        "Macro F1": 0.3554,
        "Best Validation Accuracy": 0.6120,
        "Best Validation Epoch": 14,
        "Lowest Validation Loss": 0.9665,
        "Lowest Validation Loss Epoch": 14
    },

    {
        "Model": "MobileNetV2",
        "Test Images": 550,
        "Test Accuracy": 0.5509,
        "Test Loss": 1.0242,
        "Macro Precision": 0.4075,
        "Macro Recall": 0.3141,
        "Macro F1": 0.2968,
        "Best Validation Accuracy": 0.6102,
        "Best Validation Epoch": 2,
        "Lowest Validation Loss": 1.0760,
        "Lowest Validation Loss Epoch": 18
    }

]


# ============================================================
# CREATE DATAFRAME
# ============================================================

summary_df = pd.DataFrame(results)


# ============================================================
# SAVE CSV
# ============================================================

OUTPUT_PATH = r"evaluation\experiment_summary.csv"

summary_df.to_csv(
    OUTPUT_PATH,
    index=False
)


# ============================================================
# DISPLAY
# ============================================================

print("\nExperiment Summary:\n")

print(
    summary_df.to_string(
        index=False
    )
)

print("\nSaved:")
print(OUTPUT_PATH)

print("\n" + "=" * 70)
print("EXPERIMENT SUMMARY COMPLETED")
print("=" * 70)