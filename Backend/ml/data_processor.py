import pandas as pd
import numpy as np
import os
from utils import normalize_features, derive_z_scores, save_pickle, MODEL_DIR

def process_student_data(file_path, chunk_size=100000):
    print("Starting Phase 2: WOS-IForest Training...")
    chunks = pd.read_csv(file_path, chunksize=chunk_size)
    
    all_processed = []
    
    feature_cols = ['weekly_self_study_hours', 'attendance_percentage', 'class_participation', 'total_score']
    
    for i, chunk in enumerate(chunks):
        print(f"Processing Chunk {i+1}...")
        
        # Derive Z-Scores for key metrics
        chunk = derive_z_scores(chunk, 'total_score')
        chunk = derive_z_scores(chunk, 'attendance_percentage')
        
        all_processed.append(chunk)
    
    # Concatenate all processed chunks
    df = pd.concat(all_processed)
    
    # Normalize features
    df, scaler = normalize_features(df, feature_cols)
    
    print(f"Layer 1 (WOS-IForest) Training Complete. Total Records: {len(df)}")
    
    # Save the processed data for Model Layer 1
    processed_path = os.path.join(MODEL_DIR, 'processed_data.pkl')
    save_pickle(df, 'processed_data.pkl')
        
    return df

if __name__ == "__main__":
    DATA_FILE = os.path.join(MODEL_DIR, 'student_performance.csv')
    if os.path.exists(DATA_FILE):
        process_student_data(DATA_FILE)
    else:
        print("❌ Data file not found!")
