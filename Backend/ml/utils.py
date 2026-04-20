import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import pickle
import os

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

def save_pickle(obj, filename):
    with open(os.path.join(MODEL_DIR, filename), 'wb') as f:
        pickle.dump(obj, f)

def load_pickle(filename):
    path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            return pickle.load(f)
    return None

def normalize_features(df, feature_cols, scaler_name='scaler.pkl'):
    scaler = load_pickle(scaler_name)
    if scaler is None:
        scaler = StandardScaler()
        df[feature_cols] = scaler.fit_transform(df[feature_cols])
        save_pickle(scaler, scaler_name)
    else:
        df[feature_cols] = scaler.transform(df[feature_cols])
    return df, scaler

def derive_z_scores(df, column):
    mean = df[column].mean()
    std = df[column].std()
    df[f'{column}_z'] = (df[column] - mean) / std
    return df
