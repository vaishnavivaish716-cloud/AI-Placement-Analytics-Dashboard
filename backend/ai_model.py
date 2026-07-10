import random

def predict_placement(cgpa, aptitude, communication):
    """
    AI Placement Prediction (Demo Version)
    Returns placement probability and prediction.
    """

    score = (cgpa * 10) + (aptitude * 0.4) + (communication * 0.3)

    score += random.randint(-5, 5)

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