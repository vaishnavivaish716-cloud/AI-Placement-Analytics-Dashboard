from flask import Flask, jsonify, request
from flask_cors import CORS

from ai_model import predict_placement
from routes import prediction


app = Flask(__name__)
CORS(app)

app.register_blueprint(prediction)

# ----------------------------
# Student Data
# ----------------------------

import json
import os

STUDENT_FILE = os.path.join(
    os.path.dirname(__file__),
    "students.json"
)
companies = [
    {"id": 1, "company": "TCS", "studentsPlaced": 120, "package": 4.2},
    {"id": 2, "company": "Infosys", "studentsPlaced": 95, "package": 5.0},
    {"id": 3, "company": "Accenture", "studentsPlaced": 60, "package": 6.5},
    {"id": 4, "company": "Wipro", "studentsPlaced": 45, "package": 4.0}
]

# ----------------------------
# Home
# ----------------------------
@app.route("/")
def home():
    return jsonify({
        "project": "AI Placement Analytics Dashboard",
        "status": "Running Successfully",
        "version": "2.0"
    })

# ----------------------------
# Dashboard API
# ----------------------------
@app.route("/api/dashboard")
def dashboard():

    with open("students.json", "r") as f:
        students = json.load(f)

    total_students = len(students)

    placed_students = len([
        student for student in students
        if student["status"].lower() == "placed"
    ])

    not_placed_students = total_students - placed_students

    placement_rate = 0

    if total_students > 0:
        placement_rate = round(
            (placed_students / total_students) * 100
        )

    return jsonify({

        "total_students": total_students,

        "placed_students": placed_students,

        "not_placed_students": not_placed_students,

        "placement_rate": placement_rate

    })

# ----------------------------
# Get Students
# ----------------------------
@app.route("/api/students", methods=["GET"])
def get_students():

    with open(STUDENT_FILE, "r") as f:
        students = json.load(f)

    return jsonify(students)

# ----------------------------
# Add Student
# ----------------------------
@app.route("/api/students", methods=["POST"])
def add_student():

    student = request.json

    if not os.path.exists(STUDENT_FILE):
        with open(STUDENT_FILE, "w") as f:
            json.dump([], f)

    with open(STUDENT_FILE, "r") as f:
        students = json.load(f)

    student["id"] = len(students) + 1

    students.append(student)

    with open(STUDENT_FILE, "w") as f:
        json.dump(students, f, indent=4)

    return jsonify({
        "message": "Student Added Successfully",
        "student": student
    }), 201
@app.route("/api/students/<int:id>", methods=["PUT"])
def update_student(id):
    data = request.get_json()

    for student in students:
        if student["id"] == id:
            student["name"] = data.get("name", student["name"])
            student["department"] = data.get("department", student["department"])
            student["cgpa"] = data.get("cgpa", student["cgpa"])
            student["status"] = data.get("status", student["status"])

            return jsonify({
                "message": "Student Updated Successfully",
                "student": student
            })

    return jsonify({"message": "Student Not Found"}), 404
@app.route("/api/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    global students

    for student in students:
        if student["id"] == id:
            students.remove(student)

            return jsonify({
                "message": "Student Deleted Successfully"
            })

    return jsonify({
        "message": "Student Not Found"
    }), 404


# ----------------------------
# Companies API
# ----------------------------

@app.route("/api/companies", methods=["POST"])
def add_company():
    data = request.get_json()

    new_company = {
        "id": len(companies) + 1,
        "company": data["company"],
        "studentsPlaced": data["studentsPlaced"],
        "package": data["package"]
    }

    companies.append(new_company)

    return jsonify({
        "message": "Company Added Successfully",
        "company": new_company
    }), 201
@app.route("/api/companies/<company_name>", methods=["DELETE"])
def delete_company(company_name):

    global companies

    for company in companies:

        if company["company"].lower() == company_name.lower():

            companies.remove(company)

            return jsonify({
                "message": "Company Deleted Successfully"
            })

    return jsonify({
        "message": "Company Not Found"
    }), 404



# ----------------------------
# AI Prediction API
# ----------------------------
@app.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json()

    cgpa = float(data["cgpa"])
    aptitude = float(data["aptitude"])
    communication = 75

    result = predict_placement(
        cgpa=cgpa,
        aptitude=aptitude,
        communication=communication
    )

    return jsonify(result)

# ----------------------------
# Run App
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)