import sys
import json
import numpy as np

def run_model():
    try:
        # Filepath is passed as the first argument from Node.js
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No filepath provided"}))
            return

        filepath = sys.argv[1]
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        results = []
        
        # Example processing batch data
        for student in data:
            student_id = student.get("student_id")
            features = student.get("features", [])
            
            # Dummy Logic mimicking Isolation Forest / Anomaly Detection
            # features: [weekly_self_study_hours, attendance_percentage, class_participation, total_score]
            if len(features) == 4:
                attendance = features[1]
                score = features[3]
                
                # Simple rule for mocking the "Risk" calculation
                if attendance < 60 and score < 50:
                    risk_score = 0.85
                    anomaly_flag = True
                elif attendance < 75 or score < 65:
                    risk_score = 0.60
                    anomaly_flag = False
                else:
                    risk_score = 0.20
                    anomaly_flag = False
            else:
                risk_score = 0.50
                anomaly_flag = False

            results.append({
                "student_id": student_id,
                "risk_score": round(risk_score * 100, 1),
                "anomaly_flag": anomaly_flag
            })
            
        # Ensure ONLY JSON is printed out for Node.js to capture successfully
        print(json.dumps(results))
        
    except Exception as e:
        # Return cleanly on python failure
        error_result = {"error": str(e)}
        print(json.dumps(error_result))

if __name__ == "__main__":
    run_model()
