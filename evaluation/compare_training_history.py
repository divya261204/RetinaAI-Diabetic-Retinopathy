import os
import pandas as pd
import matplotlib.pyplot as plt


# ============================================================
# FILE PATHS
# ============================================================

CNN_HISTORY = r"experiments\balanced_training_history.csv"
MOBILE_HISTORY = r"experiments\mobilenetv2_training_history.csv"

ACCURACY_OUTPUT = r"evaluation\training_validation_accuracy_comparison.png"
LOSS_OUTPUT = r"evaluation\training_validation_loss_comparison.png"


# ============================================================
# LOAD TRAINING HISTORIES
# ============================================================

print("=" * 65)
print("TRAINING HISTORY COMPARISON")
print("=" * 65)

cnn_history = pd.read_csv(CNN_HISTORY)
mobile_history = pd.read_csv(MOBILE_HISTORY)

print("\nBalanced CNN epochs:", len(cnn_history))
print("MobileNetV2 epochs:", len(mobile_history))


# ============================================================
# CNN ACCURACY
# ============================================================

plt.figure(figsize=(9, 6))

plt.plot(
    cnn_history["accuracy"],
    label="Balanced CNN Training Accuracy"
)

plt.plot(
    cnn_history["val_accuracy"],
    label="Balanced CNN Validation Accuracy"
)

plt.plot(
    mobile_history["accuracy"],
    label="MobileNetV2 Training Accuracy"
)

plt.plot(
    mobile_history["val_accuracy"],
    label="MobileNetV2 Validation Accuracy"
)

plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Training vs Validation Accuracy")

plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()

plt.savefig(
    ACCURACY_OUTPUT,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("\nSaved:")
print(ACCURACY_OUTPUT)


# ============================================================
# CNN / MOBILENET LOSS
# ============================================================

plt.figure(figsize=(9, 6))

plt.plot(
    cnn_history["loss"],
    label="Balanced CNN Training Loss"
)

plt.plot(
    cnn_history["val_loss"],
    label="Balanced CNN Validation Loss"
)

plt.plot(
    mobile_history["loss"],
    label="MobileNetV2 Training Loss"
)

plt.plot(
    mobile_history["val_loss"],
    label="MobileNetV2 Validation Loss"
)

plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training vs Validation Loss")

plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()

plt.savefig(
    LOSS_OUTPUT,
    dpi=300,
    bbox_inches="tight"
)

plt.close()

print("Saved:")
print(LOSS_OUTPUT)


# ============================================================
# BEST EPOCH INFORMATION
# ============================================================

cnn_best_accuracy_epoch = (
    cnn_history["val_accuracy"].idxmax() + 1
)

cnn_best_accuracy = (
    cnn_history["val_accuracy"].max()
)

mobile_best_accuracy_epoch = (
    mobile_history["val_accuracy"].idxmax() + 1
)

mobile_best_accuracy = (
    mobile_history["val_accuracy"].max()
)


print("\n" + "=" * 65)
print("BEST VALIDATION ACCURACY")
print("=" * 65)

print(
    f"Balanced CNN     : "
    f"Epoch {cnn_best_accuracy_epoch} "
    f"-> {cnn_best_accuracy * 100:.2f}%"
)

print(
    f"MobileNetV2      : "
    f"Epoch {mobile_best_accuracy_epoch} "
    f"-> {mobile_best_accuracy * 100:.2f}%"
)


# ============================================================
# LOWEST VALIDATION LOSS
# ============================================================

cnn_best_loss_epoch = (
    cnn_history["val_loss"].idxmin() + 1
)

cnn_best_loss = (
    cnn_history["val_loss"].min()
)

mobile_best_loss_epoch = (
    mobile_history["val_loss"].idxmin() + 1
)

mobile_best_loss = (
    mobile_history["val_loss"].min()
)


print("\n" + "=" * 65)
print("LOWEST VALIDATION LOSS")
print("=" * 65)

print(
    f"Balanced CNN     : "
    f"Epoch {cnn_best_loss_epoch} "
    f"-> {cnn_best_loss:.4f}"
)

print(
    f"MobileNetV2      : "
    f"Epoch {mobile_best_loss_epoch} "
    f"-> {mobile_best_loss:.4f}"
)


# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 65)
print("TRAINING HISTORY COMPARISON COMPLETED")
print("=" * 65)