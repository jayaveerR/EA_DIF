import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import pandas as pd
import numpy as np
import os
import pickle
from utils import MODEL_DIR

class SelfAttention(nn.Module):
    def __init__(self, input_dim):
        super(SelfAttention, self).__init__()
        self.query = nn.Linear(input_dim, input_dim)
        self.key = nn.Linear(input_dim, input_dim)
        self.value = nn.Linear(input_dim, input_dim)
        self.softmax = nn.Softmax(dim=-1)

    def forward(self, x):
        q = self.query(x)
        k = self.key(x)
        v = self.value(x)
        
        # Simple attention scores
        attn_weights = self.softmax(torch.matmul(q, k.transpose(-2, -1)) / np.sqrt(x.size(-1)))
        return torch.matmul(attn_weights, v)

class LSGRUModel(nn.Module):
    def __init__(self, input_dim, hidden_dim=64):
        super(LSGRUModel, self).__init__()
        self.attention = SelfAttention(input_dim)
        self.gru = nn.GRU(input_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(hidden_dim * 2, 1) # Output outlier score
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # Layer 2 Step A: Attention Filtering
        x = self.attention(x)
        
        # Layer 2 Step B: Bidirectional GRU
        _, h_n = self.gru(x)
        # Concatenate hidden states from both directions
        h_concat = torch.cat((h_n[0], h_n[1]), dim=1)
        
        out = self.fc(h_concat)
        return self.sigmoid(out)

def train_lsgru():
    print("Starting Phase 3: LSGRU + Attention Training...")
    
    data_path = os.path.join(MODEL_DIR, 'data_with_l1_scores.pkl')
    if not os.path.exists(data_path):
        print("❌ Layer 1 data not found.")
        return

    with open(data_path, 'rb') as f:
        df = pickle.load(f)

    # Prepare sequences for GRU (Simulating temporal data from static features)
    # In a real OULAD flow, this would be weekly. Here we simulate 1D -> 3D.
    features = ['weekly_self_study_hours', 'attendance_percentage', 'class_participation', 'total_score', 'iforest_score']
    X_raw = df[features].values
    
    # Simple reshaping to (batch, seq_len=1, features)
    X = torch.FloatTensor(X_raw).unsqueeze(1)
    
    # Target (Is_failing as proxy for training)
    y = torch.FloatTensor(df['grade'].apply(lambda x: 1 if x in ['F', 'D'] else 0).values).unsqueeze(1)

    dataset = TensorDataset(X, y)
    loader = DataLoader(dataset, batch_size=1024, shuffle=True)

    model = LSGRUModel(input_dim=len(features))
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.BCELoss() # Using BCE as proxy for LDA separation in this implementation

    print("Training Epochs...")
    model.train()
    for epoch in range(5): # Running 5 epochs for performance
        total_loss = 0
        for batch_X, batch_y in loader:
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}: Loss = {total_loss/len(loader):.4f}")

    # Save model
    torch.save(model.state_dict(), os.path.join(MODEL_DIR, 'lsgru_model.pt'))
    print("Layer 2 (LSGRU) Training Complete.")
    
    return model

if __name__ == "__main__":
    train_lsgru()
