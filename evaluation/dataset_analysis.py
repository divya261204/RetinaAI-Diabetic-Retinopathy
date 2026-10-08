import os
import pandas as pd
import matplotlib.pyplot as plt


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

print("\n========================================")
print("RETINAAI DATASET ANALYSIS")
print("========================================")


# ---------------------------------------------------------
# BASIC INFORMATION
# ---------------------------------------------------------

print("\n1. DATASET INFORMATION")
print("----------------------------------------")

print("Total images:", len(df))

print("Columns:")
print(df.columns.tolist())


# ---------------------------------------------------------
# MISSING VALUES
# ---------------------------------------------------------

print("\n2. MISSING VALUES")
print("----------------------------------------")

print(df.isnull().sum())


# ---------------------------------------------------------
# CLASS DISTRIBUTION
# ---------------------------------------------------------

print("\n3. CLASS DISTRIBUTION")
print("----------------------------------------")

class_counts = df["diagnosis"].value_counts().sort_index()

class_names = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative"
}

for class_id, count in class_counts.items():
    name = class_names.get(
        class_id,
        f"Class {class_id}"
    )

    percentage = (
        count / len(df)
    ) * 100

    print(
        f"{class_id} - {name}: "
        f"{count} images "
        f"({percentage:.2f}%)"
    )


# ---------------------------------------------------------
# IMAGE FILE CHECK
# ---------------------------------------------------------

print("\n4. IMAGE FILE CHECK")
print("----------------------------------------")

IMAGE_FOLDER = os.path.join(
    PROJECT_ROOT,
    "dataset",
    "train_images"
)

missing_images = []
found_images = 0

for image_id in df["id_code"]:

    image_path = os.path.join(
        IMAGE_FOLDER,
        image_id + ".png"
    )

    if os.path.isfile(image_path):
        found_images += 1
    else:
        missing_images.append(image_id)


print("Images found:", found_images)
print("Images missing:", len(missing_images))


if missing_images:
    print("\nMissing image IDs:")
    for image_id in missing_images[:20]:
        print(image_id)


# ---------------------------------------------------------
# CLASS DISTRIBUTION GRAPH
# ---------------------------------------------------------

print("\n5. CREATING CLASS DISTRIBUTION GRAPH")
print("----------------------------------------")

labels = []

for class_id in class_counts.index:
    labels.append(
        class_names.get(
            class_id,
            f"Class {class_id}"
        )
    )

plt.figure(figsize=(10, 6))

plt.bar(
    labels,
    class_counts.values
)

plt.title(
    "Diabetic Retinopathy Dataset Class Distribution"
)

plt.xlabel("DR Class")
plt.ylabel("Number of Images")

plt.xticks(rotation=20)

plt.tight_layout()


GRAPH_PATH = os.path.join(
    PROJECT_ROOT,
    "evaluation",
    "class_distribution.png"
)

plt.savefig(GRAPH_PATH)

plt.show()

print(
    "\nGraph saved to:"
)

print(GRAPH_PATH)


# ---------------------------------------------------------
# FINAL SUMMARY
# ---------------------------------------------------------

print("\n========================================")
print("DATASET ANALYSIS COMPLETED")
print("========================================")

print(
    "Total images:",
    len(df)
)

print(
    "Images found:",
    found_images
)

print(
    "Images missing:",
    len(missing_images)
)

print("\nClass distribution:")

for class_id, count in class_counts.items():

    print(
        class_names.get(
            class_id,
            f"Class {class_id}"
        ),
        ":",
        count
    )

print("\n========================================")