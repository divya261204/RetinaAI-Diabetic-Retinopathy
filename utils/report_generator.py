import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf_report(
    output_path: str,
    patient_info: dict,
    prediction_info: dict,
    original_img_path: str = None,
    gradcam_img_path: str = None
):
    """
    Generates a high-quality clinical Diabetic Retinopathy screening PDF report.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )
    
    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )
    
    bold_body_style = ParagraphStyle(
        'BoldBodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0f172a')
    )
    
    story = []
    
    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>RetinaAI Clinical Diagnostics</b><br/><font size=8 color='#64748b'>AI-Assisted Ophthalmic Screening Platform</font>", title_style),
            Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d %b %Y %H:%M')}<br/><b>Report ID:</b> {patient_info.get('report_id', 'RPT-' + datetime.now().strftime('%y%m%d%H%M'))}", body_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[350, 170])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563eb'), spaceBefore=8, spaceAfter=14))
    
    # 2. Patient & Screening Information Table
    patient_data = [
        [Paragraph("<b>Patient Name:</b>", body_style), Paragraph(str(patient_info.get("name", "Anonymous")), bold_body_style),
         Paragraph("<b>Patient ID / MRN:</b>", body_style), Paragraph(str(patient_info.get("id", "N/A")), bold_body_style)],
        [Paragraph("<b>Age / Gender:</b>", body_style), Paragraph(f"{patient_info.get('age', 'N/A')} / {patient_info.get('gender', 'N/A')}", body_style),
         Paragraph("<b>Image Quality:</b>", body_style), Paragraph(f"{patient_info.get('quality_status', 'Good')} ({patient_info.get('quality_sharpness', 'N/A')} var)", body_style)],
        [Paragraph("<b>TTA Inference:</b>", body_style), Paragraph("Enabled (Multi-Scale Flip Avg)" if prediction_info.get("tta_applied") else "Standard Inference", body_style),
         Paragraph("<b>Primary Model:</b>", body_style), Paragraph("Fine-Tuned MobileNetV2 (70.36% Acc)", body_style)]
    ]
    patient_table = Table(patient_data, colWidths=[95, 165, 110, 150])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 14))
    
    # 3. Diagnosis Result Card
    prediction = prediction_info.get("prediction", "No DR")
    confidence = prediction_info.get("confidence", 0.0)
    
    severity_colors = {
        "No DR": colors.HexColor('#16a34a'),
        "Mild": colors.HexColor('#eab308'),
        "Moderate": colors.HexColor('#f97316'),
        "Severe": colors.HexColor('#dc2626'),
        "Proliferative": colors.HexColor('#991b1b')
    }
    pred_color = severity_colors.get(prediction, colors.HexColor('#2563eb'))
    
    pred_data = [
        [
            Paragraph(f"<font size=11 color='#64748b'>Predicted Diabetic Retinopathy Stage</font><br/><font size=16 color='{pred_color.hexval()}'><b>{prediction}</b></font>", body_style),
            Paragraph(f"<font size=11 color='#64748b'>Model Confidence</font><br/><font size=16 color='#0f172a'><b>{confidence:.2f}%</b></font>", body_style),
            Paragraph(f"<font size=11 color='#64748b'>Lesion Coverage Area</font><br/><font size=16 color='#0f172a'><b>{prediction_info.get('lesion_area_pct', 0.0):.1f}%</b></font>", body_style)
        ]
    ]
    pred_table = Table(pred_data, colWidths=[180, 170, 170])
    pred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(pred_table)
    story.append(Spacer(1, 14))
    
    # 4. Images (Fundus & Grad-CAM)
    img_cells = []
    if original_img_path and os.path.exists(original_img_path):
        img_cells.append([
            RLImage(original_img_path, width=2.4*inch, height=2.4*inch),
            Paragraph("<b>Original Fundus Retinal Image</b><br/><font size=8 color='#64748b'>Preprocessed & contrast-enhanced</font>", body_style)
        ])
    else:
        img_cells.append([Paragraph("No Fundus Image", body_style), Paragraph("", body_style)])
        
    if gradcam_img_path and os.path.exists(gradcam_img_path):
        img_cells.append([
            RLImage(gradcam_img_path, width=2.4*inch, height=2.4*inch),
            Paragraph("<b>Grad-CAM Explainability Heatmap</b><br/><font size=8 color='#64748b'>High activation highlights microaneurysms/exudates</font>", body_style)
        ])
    else:
        img_cells.append([Paragraph("No Grad-CAM Overlay", body_style), Paragraph("", body_style)])
        
    img_table_data = [
        [img_cells[0][0], img_cells[1][0]],
        [img_cells[0][1], img_cells[1][1]]
    ]
    img_table = Table(img_table_data, colWidths=[260, 260])
    img_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(img_table)
    story.append(Spacer(1, 10))
    
    # 5. Probabilities Table
    story.append(Paragraph("<b>5-Stage Probability Breakdown</b>", section_style))
    probs = prediction_info.get("probabilities", [0, 0, 0, 0, 0])
    class_names = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]
    
    prob_header = [Paragraph(f"<b>{c}</b>", bold_body_style) for c in class_names]
    prob_vals = [Paragraph(f"{p:.2f}%", body_style) for p in probs]
    
    prob_table = Table([prob_header, prob_vals], colWidths=[104]*5)
    prob_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(prob_table)
    story.append(Spacer(1, 12))
    
    # 6. Clinical Recommendations
    rec_text = prediction_info.get("recommendation", "Follow standard diabetic screening protocol.")
    rec_data = [
        [
            Paragraph("<b>Clinical Guidance & Referral Urgency:</b>", bold_body_style),
            Paragraph(rec_text, body_style)
        ]
    ]
    rec_table = Table(rec_data, colWidths=[160, 360])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff6ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#93c5fd')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(rec_table)
    story.append(Spacer(1, 14))
    
    # 7. Disclaimer & Signature
    disclaimer = Paragraph(
        "<font size=7 color='#64748b'><b>DISCLAIMER:</b> This report is generated by an Artificial Intelligence screening model (RetinaAI). It is designed to assist healthcare professionals and should be verified by a licensed ophthalmologist or optometrist before initiating clinical treatment.</font>",
        body_style
    )
    story.append(disclaimer)
    story.append(Spacer(1, 15))
    
    sig_data = [
        [
            Paragraph("<b>Reviewed by Clinician:</b> ___________________________", body_style),
            Paragraph("<b>Signature / Date:</b> ___________________________", body_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[260, 260])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(sig_table)
    
    doc.build(story)
    return output_path
