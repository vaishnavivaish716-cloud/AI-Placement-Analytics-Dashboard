import random
import joblib
import os
#model = joblib.load(os.path.join(os.path.dirname(__file__), "model", "trained_model.pkl"))
#scaler = joblib.load(os.path.join(os.path.dirname(__file__), "model", "scaler.pkl"))

def predict_placement(cgpa, aptitude, communication):

      score = (cgpa * 10) + (aptitude * 0.4) + (communication * 0.3)

      if score >= 80:
           prediction = "Highly Likely to be Placed"
           probability = "90-99%"
      elif score >= 65:
           prediction = "Likely to be Placed"
           probability = "70-89%"
      elif score >= 50:
           prediction = "Needs Improvement"
           probability = "40-69%"
      else:
           prediction = "Low Placement Chance"
           probability = "Below 40%"

      return {
    "prediction": prediction,
    "probability": probability,
    "score": round(score, 2)
}