import torch
import numpy as np
import pickle
import os
from lsgru_model import LSGRUModel
from utils import load_pickle, MODEL_DIR

def calculate_dif_score(alpha=0.6):
    print("Calculating Combined DIF Scores (Layer 1 + Layer 2)...")
    
    # Load Models
    iforest = load_pickle('wos_iforest_model.pkl')
    lsgru = LSGRUModel(input_dim=5)
    lsgru.load_state_dict(torch.load(os.path.join(MODEL_DIR, 'lsgru_model.pt')))
    lsgru.eval()
    
    # Load Processed Data
    data_path = os.path.join(MODEL_DIR, 'processed_data.pkl')
    with open(data_path, 'rb') as f:
        df = pickle.load(f)

    # Features
    feature_cols = ['weekly_self_study_hours', 'attendance_percentage', 'class_participation', 'total_score']
    X_vals = df[feature_cols].values
    
    # Layer 1 Scores (Normalized 0-1, where 1 is anomaly)
    l1_raw = iforest.decision_function(X_vals)
    l1_norm = 1 - (l1_raw - l1_raw.min()) / (l1_raw.max() - l1_raw.min())
    
    # Layer 2 Predictions
    X_l1 = np.column_stack((X_vals, l1_raw))
    X_torch = torch.FloatTensor(X_l1).unsqueeze(1)
    
    with torch.no_grad():
        l2_raw = lsgru(X_torch).squeeze().numpy()
    
    # Hybrid DIF Scoring
    dif_score = (alpha * l1_norm) + ((1 - alpha) * l2_raw)
    
    # Scale to 0-100
    df['risk_score'] = dif_score * 100
    
    print(f"Final Scores Calculated. Avg Risk: {df['risk_score'].mean():.2f}%")
    
    # Save results
    with open(os.path.join(MODEL_DIR, 'final_predictions.pkl'), 'wb') as f:
        pickle.dump(df, f)
    
    return df

if __name__ == "__main__":
    calculate_dif_score()
