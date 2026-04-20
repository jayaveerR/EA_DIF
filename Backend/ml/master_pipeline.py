import os
import sys
import json
import pickle
import pandas as pd
from pymongo import MongoClient
import data_processor
import wos_iforest
import lsgru_model
import dif_scorer
import shap_explainer
import adwin_monitor
from utils import MODEL_DIR

# MongoDB Configuration (Atlas Cloud)
MONGO_URI = "mongodb+srv://Jayaveer:Jayaveer@bookmyshow.xvoyyoc.mongodb.net/EA-DIF"
DB_NAME = "EA-DIF"

def sync_to_mongodb(predictions_df, explanations):
    print("Syncing Results to MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    # 1. Update Predictions Collection
    db.predictions.drop() # Refresh data
    pred_records = predictions_df.to_dict('records')
    db.predictions.insert_many(pred_records)
    
    # 2. Update Alerts Collection with SHAP Reasons
    db.alerts.drop() 
    alert_records = []
    for exp in explanations:
        alert_records.append({
            'student_id': str(exp['student_id']),
            'risk_score': float(exp['risk_score']),
            'status': "High" if exp['risk_score'] > 75 else "Medium",
            'reason': exp['reasons'],
            'timestamp': pd.Timestamp.now()
        })
    if alert_records:
        db.alerts.insert_many(alert_records)

    # 3. Update Students Collection (Targeting a stable view)
    # We sync a representative sample or the whole set if needed
    db.students.drop()
    student_records = predictions_df[['student_id', 'weekly_self_study_hours', 'attendance_percentage', 'class_participation', 'total_score', 'grade']].to_dict('records')
    db.students.insert_many(student_records)
    
    print(f"✅ MongoDB Sync Complete. {len(pred_records)} predictions, {len(alert_records)} alerts, and {len(student_records)} students updated.")

def run_all():
    print("EA-DIF Master Pipeline Started...")
    
    # Step 1: Preprocessing
    data_processor.process_student_data(os.path.join(MODEL_DIR, 'student_performance.csv'))
    
    # Training completed in previous run, skipping to scoring and sync
    # wos_iforest.train_wos_iforest()
    # lsgru_model.train_lsgru()
    
    # Step 4 & 5: Combined Scoring
    df = dif_scorer.calculate_dif_score()
    
    # Step 6: SHAP Explanations
    explanations = shap_explainer.generate_explanations()
    
    # Step 7: Drift Monitoring (Self-test)
    adwin_monitor.monitor_drift([0.97, 0.96, 0.98, 0.95, 0.82]) # Simulated accuracy with a drop
    
    # Step 8: DB Sync
    import pandas as pd
    sync_to_mongodb(df, explanations)
    
    print("✨ Full System Operational and Synchronized.")

if __name__ == "__main__":
    run_all()
