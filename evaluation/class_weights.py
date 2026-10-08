import os
import pandas as pd
from sklearn.utils.class_weight import compute_class_weight
import numpy as np


# ---------------------------------------------------------
# PROJECT PATH
# ---------------------------------------------------------

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

CSV_PATH = os.path.join(
    PROJECT_ROOT,
    "dataset",
    "train.csv"
)


# ---------------------------------------------------------
# LOAD DATASET
# ---------------------------------------------------------

df = pd.read_csv(CSV_PATH)

labels = df["diagnosis"].values


# ---------------------------------------------------------
# CALCULATE CLASS WEIGHTS
# ---------------------------------------------------------

classes = np.unique(labels)

weights = compute_class_weight(
    class_weight="balanced",
    classes=classes,
    y=labels
)


# ---------------------------------------------------------
# DISPLAY RESULTS
# ---------------------------------------------------------

class_names = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative"
}


print("\n========================================")
print("RETINAAI CLASS WEIGHT ANALYSIS")
print("========================================")

print("\nClass weights:")

class_weights = {}

for class_id, weight in zip(classes, weights):

    class_weights[int(class_id)] = float(weight)

    print(
        f"{class_id} - "
        f"{class_names[int(class_id)]}: "
        f"{weight:.4f}"
    )


# ---------------------------------------------------------
# SAVE CLASS WEIGHTS
# ---------------------------------------------------------

OUTPUT_PATH = os.path.join(
    PROJECT_ROOT,
    "evaluation",
    "class_weights.txt"
)

with open(
    OUTPUT_PATH,
    "w",
    encoding="utf-8"
) as file:

    for class_id, weight in class_weights.items():

        file.write(
            f"{class_id}: {weight:.6f}\n"
        )


print("\nClass weights saved to:")

print(OUTPUT_PATH)

print("\n========================================")
print("CLASS WEIGHT ANALYSIS COMPLETED")
print("========================================")