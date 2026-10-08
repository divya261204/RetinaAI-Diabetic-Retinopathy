import pandas as pd
import matplotlib.pyplot as plt

# ============================================================
# PATHS
# ============================================================

HISTORY_PATH = r"experiments\balanced_training_history.csv"

ACCURACY_IMAGE = r"evaluation\balanced_training_accuracy.png"
LOSS_IMAGE = r"evaluation\balanced_training_loss.png"

# ============================================================
# LOAD TRAINING HISTORY
# ============================================================

print("\nLoading training history...")

history = pd.read_csv(HISTORY_PATH)

print("Available columns:")
print(history.columns.tolist())

# ============================================================
# TRAINING / VALIDATION ACCURACY
# ============================================================

plt.figure(figsize=(10, 6))

plt.plot(
    history["accuracy"],
    label="Training Accuracy"
)

plt.plot(
    history["val_accuracy"],
    label="Validation Accuracy"
)

plt.title(
    "Balanced CNN - Training and Validation Accuracy"
)

plt.xlabel("Epoch")
plt.ylabel("Accuracy")

plt.legend()

plt.grid(True, alpha=0.3)

plt.tight_layout()

plt.savefig(
    ACCURACY_IMAGE,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print(
    f"Saved: {ACCURACY_IMAGE}"
)

# ============================================================
# TRAINING / VALIDATION LOSS
# ============================================================

plt.figure(figsize=(10, 6))

plt.plot(
    history["loss"],
    label="Training Loss"
)

plt.plot(
    history["val_loss"],
    label="Validation Loss"
)

plt.title(
    "Balanced CNN - Training and Validation Loss"
)

plt.xlabel("Epoch")
plt.ylabel("Loss")

plt.legend()

plt.grid(True, alpha=0.3)

plt.tight_layout()

plt.savefig(
    LOSS_IMAGE,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print(
    f"Saved: {LOSS_IMAGE}"
)

# ============================================================
# BEST EPOCH
# ============================================================

best_epoch = (
    history["val_accuracy"].idxmax() + 1
)

best_val_accuracy = (
    history["val_accuracy"].max()
)

best_val_loss = (
    history["val_loss"].min()
)

print("\n==========================================")
print("TRAINING SUMMARY")
print("==========================================")

print(
    f"Best validation accuracy epoch : {best_epoch}"
)

print(
    f"Best validation accuracy       : "
    f"{best_val_accuracy * 100:.2f}%"
)

print(
    f"Lowest validation loss         : "
    f"{best_val_loss:.4f}"
)

print("\nTraining graphs created successfully.")