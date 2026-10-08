import pandas as pd
import matplotlib.pyplot as plt

print("=" * 70)
print("THREE-MODEL PERFORMANCE COMPARISON")
print("=" * 70)

# ============================================================
# MODEL RESULTS
# ============================================================

results = [
    {
        "Model": "Balanced CNN",
        "Accuracy": 0.6509,
        "Macro Precision": 0.3389,
        "Macro Recall": 0.4050,
        "Macro F1": 0.3554
    },
    {
        "Model": "MobileNetV2",
        "Accuracy": 0.5509,
        "Macro Precision": 0.4075,
        "Macro Recall": 0.3141,
        "Macro F1": 0.2968
    },
    {
        "Model": "Fine-tuned MobileNetV2",
        "Accuracy": 0.7036,
        "Macro Precision": 0.5900,
        "Macro Recall": 0.5200,
        "Macro F1": 0.5000
    }
]

df = pd.DataFrame(results)

# ============================================================
# DISPLAY RESULTS
# ============================================================

print("\nOVERALL MODEL COMPARISON")
print("-" * 70)

display_df = df.copy()

for column in [
    "Accuracy",
    "Macro Precision",
    "Macro Recall",
    "Macro F1"
]:
    display_df[column] = (
        display_df[column] * 100
    ).round(2).astype(str) + "%"

print(display_df.to_string(index=False))

# ============================================================
# SAVE CSV
# ============================================================

output_path = r"evaluation\three_model_comparison.csv"

df.to_csv(
    output_path,
    index=False
)

print("\nSaved:")
print(output_path)

# ============================================================
# ACCURACY COMPARISON GRAPH
# ============================================================

plt.figure(figsize=(10, 6))

models = df["Model"]
accuracy = df["Accuracy"] * 100

bars = plt.bar(
    models,
    accuracy
)

plt.title(
    "Test Accuracy Comparison of Three Models"
)

plt.xlabel("Model")

plt.ylabel("Test Accuracy (%)")

plt.ylim(0, 100)

plt.xticks(
    rotation=15,
    ha="right"
)

for bar, value in zip(bars, accuracy):

    plt.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 1,
        f"{value:.2f}%",
        ha="center",
        va="bottom"
    )

plt.tight_layout()

accuracy_graph = (
    r"evaluation\three_model_accuracy_comparison.png"
)

plt.savefig(
    accuracy_graph,
    dpi=300
)

plt.close()

print(accuracy_graph)

# ============================================================
# MACRO F1 COMPARISON GRAPH
# ============================================================

plt.figure(figsize=(10, 6))

macro_f1 = df["Macro F1"] * 100

bars = plt.bar(
    models,
    macro_f1
)

plt.title(
    "Macro F1-Score Comparison of Three Models"
)

plt.xlabel("Model")

plt.ylabel("Macro F1-Score (%)")

plt.ylim(0, 100)

plt.xticks(
    rotation=15,
    ha="right"
)

for bar, value in zip(bars, macro_f1):

    plt.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 1,
        f"{value:.2f}%",
        ha="center",
        va="bottom"
    )

plt.tight_layout()

f1_graph = (
    r"evaluation\three_model_macro_f1_comparison.png"
)

plt.savefig(
    f1_graph,
    dpi=300
)

plt.close()

print(f1_graph)

# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 70)
print("THREE-MODEL COMPARISON COMPLETED")
print("=" * 70)