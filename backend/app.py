from flask import Flask, jsonify
from flask_cors import CORS

from ai_model import predict_placement
from routes import prediction

app = Flask(__name__)
CORS(app)

app.register_blueprint(prediction)


@app.route("/")
def home():
    return jsonify({
        "project": "AI Placement Analytics Dashboard",
        "status": "Running Successfully",
        "version": "2.0"
    })


@app.route("/api/dashboard")
def dashboard():
    data = {
        "total_students": 500,
        "placed_students": 420,
        "placement_rate": "84%",
        "companies_visited": 35
    }
    return jsonify(data)

@app.route("/api/students")
def get_students():
    students = [
        {"id": 1, "name": "Arun", "department": "CSE", "cgpa": 8.9, "status": "Placed"},
        {"id": 2, "name": "Priya", "department": "IT", "cgpa": 8.1, "status": "Placed"},
        {"id": 3, "name": "Rahul", "department": "ECE", "cgpa": 7.4, "status": "Not Placed"},
        {"id": 4, "name": "Kavin", "department": "AIDS", "cgpa": 9.2, "status": "Placed"},
        {"id": 5, "name": "Divya", "department": "EEE", "cgpa": 6.9, "status": "Not Placed"}
    ]
    return jsonify(students)


@app.route("/api/companies")
def get_companies():
    companies = [
        {"company": "TCS", "studentsPlaced": 120, "package": 4.2},
        {"company": "Infosys", "studentsPlaced": 95, "package": 5.0},
        {"company": "Accenture", "studentsPlaced": 60, "package": 6.5},
        {"company": "Wipro", "studentsPlaced": 45, "package": 4.0}
    ]
    return jsonify(companies)

@app.route("/api/predict")
def predict():
    result = predict_placement(
        cgpa=8.5,
        aptitude=80,
        communication=75
    )
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)