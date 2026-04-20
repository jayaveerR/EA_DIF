import shap
import pickle
import os
import numpy as np
import pandas as pd
from utils import load_pickle, MODEL_DIR

def generate_explanations(threshold=70):
    print(f"Generating SHAP Explanations for students with Risk > {threshold}%...")
    
    # Load Data and Model
    with open(os.path.join(MODEL_DIR, 'final_predictions.pkl'), 'rb') as f:
        df = pickle.load(f)
    
    iforest = load_pickle('wos_iforest_model.pkl')
    
    # Filter only High Risk Students (Optimized for performance)
    anomalies = df[df['risk_score'] > threshold].copy()
    
    if len(anomalies) == 0:
        print("✅ No significant anomalies detected for SHAP analysis.")
        return []

    feature_cols = ['weekly_self_study_hours', 'attendance_percentage', 'class_participation', 'total_score']
    X_anom = anomalies[feature_cols]

    # Initialize TreeExplainer for IForest
    explainer = shap.TreeExplainer(iforest)
    shap_values = explainer.shap_values(X_anom)
    
    # Extract top 3 features for each anomaly
    results = []
    for i, (idx, row) in enumerate(anomalies.iterrows()):
        sv = shap_values[i]
        # Get indices of top negative contributors (most likely reasons for anomaly)
        top_indices = np.argsort(sv)[:3]
        
        reasons = []
        for ti in top_indices:
            feature_name = feature_cols[ti]
            val = sv[ti]
            impact = "Low" if val < 0 else "High"
            reasons.append(f"{feature_name.replace('_', ' ').title()}")
        
        results.append({
            'student_id': row['student_id'],
            'risk_score': row['risk_score'],
            'reasons': ", ".join(reasons)
        })

    print(f"Generated {len(results)} SHAP based explanations.")
    
    with open(os.path.join(MODEL_DIR, 'explanations.pkl'), 'wb') as f:
        pickle.dump(results, f)
        
    return results

if __name__ == "__main__":
    generate_explanations()
