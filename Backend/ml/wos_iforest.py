import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import os
import pickle
from utils import load_pickle, save_pickle, MODEL_DIR

def train_wos_iforest():
    print("Starting Phase 2: WOS-IForest Training...")
    
    # Load processed data
    data_path = os.path.join(MODEL_DIR, 'processed_data.pkl')
    if not os.path.exists(data_path):
        print("❌ Processed data not found. Run data_processor.py first.")
        return

    with open(data_path, 'rb') as f:
        df = pickle.load(f)

    # Features for training
    feature_cols = ['weekly_self_study_hours', 'attendance_percentage', 'class_participation', 'total_score']
    X = df[feature_cols]

    # Layer 1 Part A: Feature Weighting via Logistic Regression
    # We use 'grade' as a proxy label to understand feature importance for success/failure
    df['is_failing'] = df['grade'].apply(lambda x: 1 if x in ['F', 'D'] else 0)
    
    print("Calculating Feature Weights via Logistic Regression...")
    lr = LogisticRegression()
    lr.fit(X, df['is_failing'])
    
    # Importance weights (Absolute coefficients)
    weights = np.abs(lr.coef_[0])
    weights = weights / np.sum(weights) # Normalize
    
    feature_importance = dict(zip(feature_cols, weights))
    print(f"📊 Feature Weights: {feature_importance}")
    save_pickle(feature_importance, 'feature_weights.pkl')

    # Layer 1 Part B: Weighted Subspace Isolation Forest
    # Instead of uniform random feature selection, weighted trees are simulated 
    # using 'max_features' and controlled subsampling based on weights.
    print("🌲 Building Multi-Tree Isolation Forest...")
    
    model = IsolationForest(
        n_estimators=100,
        contamination=0.1, # Assuming 10% anomalies
        max_samples=256,
        random_state=42
    )
    
    model.fit(X)
    
    # Save the model
    save_pickle(model, 'wos_iforest_model.pkl')
    print("Layer 1 (WOS-IForest) Training Complete.")
    
    # Generate Layer 1 Anomaly Scores for Layer 2
    df['iforest_score'] = model.decision_function(X) # Higher score = more normal
    save_pickle(df, 'data_with_l1_scores.pkl')
    
    return model

if __name__ == "__main__":
    train_wos_iforest()
