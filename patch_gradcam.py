from pathlib import Path

p = Path("app.py")
s = p.read_text(encoding="utf-8-sig")

s = s.replace(
    '"gradcam_success": gradcam_result.get("success", False),',
    '"gradcam_success": gradcam_result.get("heatmap_image") is not None,'
)

s = s.replace(
    '"heatmap_image": gradcam_result.get("heatmap"),',
    '"heatmap_image": gradcam_result.get("heatmap_image"),'
)

s = s.replace(
    '"result_image": gradcam_result.get("overlay"),',
    '"result_image": gradcam_result.get("result_image"),'
)

p.write_text(s, encoding="utf-8")

print("GRAD-CAM KEY FIX SUCCESS")