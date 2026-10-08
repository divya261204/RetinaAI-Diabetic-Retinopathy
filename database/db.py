import sqlite3
import json
import os
from datetime import datetime

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "screenings.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS screenings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT,
            patient_name TEXT,
            patient_age INTEGER,
            patient_gender TEXT,
            filename TEXT,
            original_image_url TEXT,
            heatmap_image_url TEXT,
            overlay_image_url TEXT,
            prediction TEXT,
            predicted_class INTEGER,
            confidence REAL,
            probabilities TEXT,
            quality_status TEXT,
            quality_sharpness REAL,
            quality_brightness REAL,
            lesion_area_pct REAL,
            risk_level TEXT,
            recommendation TEXT,
            tta_applied INTEGER DEFAULT 0,
            report_filename TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_screening(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    probabilities_json = json.dumps(data.get("probabilities", []))
    
    cursor.execute("""
        INSERT INTO screenings (
            patient_id, patient_name, patient_age, patient_gender,
            filename, original_image_url, heatmap_image_url, overlay_image_url,
            prediction, predicted_class, confidence, probabilities,
            quality_status, quality_sharpness, quality_brightness,
            lesion_area_pct, risk_level, recommendation, tta_applied,
            report_filename, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("patient_id", "ANON-" + datetime.now().strftime("%y%m%d%H%M")),
        data.get("patient_name", "Anonymous"),
        data.get("patient_age", None),
        data.get("patient_gender", "Unknown"),
        data.get("filename", ""),
        data.get("original_image_url", ""),
        data.get("heatmap_image_url", ""),
        data.get("overlay_image_url", ""),
        data.get("prediction", "Unknown"),
        data.get("predicted_class", 0),
        data.get("confidence", 0.0),
        probabilities_json,
        data.get("quality_status", "Good"),
        data.get("quality_sharpness", 0.0),
        data.get("quality_brightness", 0.0),
        data.get("lesion_area_pct", 0.0),
        data.get("risk_level", "Low"),
        data.get("recommendation", ""),
        1 if data.get("tta_applied") else 0,
        data.get("report_filename", ""),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    
    inserted_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return inserted_id

def get_all_screenings(search=None, filter_stage=None, limit=100):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM screenings WHERE 1=1"
    params = []
    
    if search:
        query += " AND (patient_name LIKE ? OR patient_id LIKE ? OR prediction LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])
        
    if filter_stage and filter_stage != "All":
        query += " AND prediction = ?"
        params.append(filter_stage)
        
    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    results = []
    for row in rows:
        item = dict(row)
        if item.get("probabilities"):
            try:
                item["probabilities"] = json.loads(item["probabilities"])
            except Exception:
                item["probabilities"] = []
        results.append(item)
        
    conn.close()
    return results

def get_screening_by_id(screening_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM screenings WHERE id = ?", (screening_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
    item = dict(row)
    if item.get("probabilities"):
        try:
            item["probabilities"] = json.loads(item["probabilities"])
        except Exception:
            item["probabilities"] = []
    return item

def delete_screening(screening_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM screenings WHERE id = ?", (screening_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_screenings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM screenings")
    conn.commit()
    conn.close()

def get_screening_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM screenings")
    total = cursor.fetchone()["total"]
    
    cursor.execute("""
        SELECT prediction, COUNT(*) as count 
        FROM screenings 
        GROUP BY prediction
    """)
    stage_counts = {row["prediction"]: row["count"] for row in cursor.fetchall()}
    
    cursor.execute("SELECT AVG(confidence) as avg_conf FROM screenings")
    avg_conf_row = cursor.fetchone()
    avg_confidence = round(avg_conf_row["avg_conf"], 2) if avg_conf_row and avg_conf_row["avg_conf"] else 0.0
    
    cursor.execute("""
        SELECT COUNT(*) as urgent_count 
        FROM screenings 
        WHERE prediction IN ('Severe', 'Proliferative')
    """)
    urgent_count = cursor.fetchone()["urgent_count"]
    
    conn.close()
    
    return {
        "total_screenings": total,
        "stage_breakdown": stage_counts,
        "average_confidence": avg_confidence,
        "urgent_cases": urgent_count
    }

def get_screenings_csv():
    import csv
    import io
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, patient_id, patient_name, patient_age, patient_gender, filename, prediction, predicted_class, confidence, quality_status, lesion_area_pct, risk_level, recommendation, tta_applied, created_at FROM screenings ORDER BY id DESC")
    rows = cursor.fetchall()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Record ID", "Patient ID", "Patient Name", "Age", "Gender", 
        "Filename", "Diagnosis", "Stage Class", "Confidence (%)", 
        "Image Quality", "Lesion Area (%)", "Risk Level", "Recommendation", 
        "TTA Applied", "Screening Date"
    ])
    for row in rows:
        writer.writerow(list(row))
    conn.close()
    return output.getvalue()

# Initialize on import
init_db()
