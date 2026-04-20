from river import drift
import pickle
import os
import random
from utils import MODEL_DIR

def monitor_drift(current_accuracy_stream):
    print("Initializing ADWIN Drift Monitor...")
    
    adwin = drift.ADWIN()
    drifts_detected = []
    
    for i, acc in enumerate(current_accuracy_stream):
        # Update the ADWIN monitor with current accuracy
        adwin.update(acc)
        
        # Check if a drift has occurred
        if adwin.drift_detected:
            print(f"Drift detected at data point {i}! Current Window Accuracy changed significantly.")
            drifts_detected.append(i)
            # In a real scenario, this would trigger a re-train
            
    # Save the drift state
    drift_path = os.path.join(MODEL_DIR, 'drift_status.pkl')
    with open(drift_path, 'wb') as f:
        pickle.dump({
            'has_drift': len(drifts_detected) > 0,
            'last_check_size': len(current_accuracy_stream),
            'detected_points': drifts_detected
        }, f)
        
    return drifts_detected

if __name__ == "__main__":
    # Simulate an accuracy stream for testing
    # Starts high, then drops to simulate drift
    stream = [0.98] * 100 + [0.85] * 20 
    monitor_drift(stream)
