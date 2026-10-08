import os
import shutil
import pandas as pd
import json

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(PROJECT_ROOT, "dataset", "train.csv")
IMG_DIR = os.path.join(PROJECT_ROOT, "dataset", "train_images")
SAMPLES_DIR = os.path.join(PROJECT_ROOT, "static", "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)
class_names = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]
sample_records = []

for diag in range(5):
    subset = df[df["diagnosis"] == diag]
    for _, row in subset.iterrows():
        src = os.path.join(IMG_DIR, f"{row['id_code']}.png")
        if os.path.exists(src):
            dst = os.path.join(SAMPLES_DIR, f"sample_stage_{diag}_{row['id_code']}.png")
            shutil.copyfile(src, dst)
            sample_records.append({
                "stage": diag,
                "stage_name": class_names[diag],
                "filename": os.path.basename(dst),
                "url": f"/static/samples/{os.path.basename(dst)}",
                "id_code": row["id_code"]
            })
            break

print("Extracted 5 sample images:")
for s in sample_records:
    print(f"Stage {s['stage']} ({s['stage_name']}): {s['url']}")

with open(os.path.join(SAMPLES_DIR, "samples.json"), "w") as f:
    json.dump(sample_records, f, indent=2)
