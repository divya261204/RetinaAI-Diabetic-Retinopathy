import pandas as pd
from sklearn.model_selection import train_test_split

# Load the dataset CSV
df = pd.read_csv("dataset/train.csv")

# Split the data into training and validation sets
train_df, val_df = train_test_split(
    df,
    test_size=0.20,
    stratify=df["diagnosis"],
    random_state=42
)

# Save the split files
train_df.to_csv("dataset/train_split.csv", index=False)
val_df.to_csv("dataset/val_split.csv", index=False)

print("Dataset split completed successfully!")
print("Training images:", len(train_df))
print("Validation images:", len(val_df))