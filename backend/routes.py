from flask import Blueprint, jsonify, request
import json
import os

from database import get_db_connection

prediction = Blueprint("prediction", __name__)

COMPANY_FILE = "companies.json"
STUDENT_FILE = "students.json"


@prediction.route("/companies", methods=["GET"])
def get_companies():

    if not os.path.exists(COMPANY_FILE):
        with open(COMPANY_FILE, "w") as f:
            json.dump([], f)

    with open(COMPANY_FILE, "r") as f:
        data = json.load(f)

    return jsonify(data)


@prediction.route("/companies", methods=["POST"])
def add_company():

    company = request.json

    if not os.path.exists(COMPANY_FILE):
        with open(COMPANY_FILE, "w") as f:
            json.dump([], f)

    with open(COMPANY_FILE, "r") as f:
        data = json.load(f)

    data.append(company)

    with open(COMPANY_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({
        "message": "Company Added Successfully"
    })
@prediction.route("/companies/<company_name>", methods=["DELETE"])
def delete_company(company_name):

    if not os.path.exists(COMPANY_FILE):
        return jsonify({
            "message": "Company file not found"
        }), 404

    with open(COMPANY_FILE, "r") as f:
        data = json.load(f)

    new_data = [
        company for company in data
        if company.get("company") != company_name
    ]

    if len(new_data) == len(data):
        return jsonify({
            "message": "Company not found"
        }), 404

    with open(COMPANY_FILE, "w") as f:
        json.dump(new_data, f, indent=4)

    return jsonify({
        "message": "Company deleted successfully"
    })
@prediction.route("/companies/<company_name>", methods=["PUT"])
def edit_company(company_name):

    updated_data = request.json

    with open(COMPANY_FILE, "r") as f:
        data = json.load(f)

    for company in data:

        if company.get("company") == company_name:

            company["role"] = updated_data["role"]

            break

    with open(COMPANY_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({
        "message": "Company role updated successfully"
    })
@prediction.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):

    updated_student = request.json

    with open(STUDENT_FILE, "r") as f:
        data = json.load(f)

    for student in data:

        if student["id"] == student_id:

            student["name"] = updated_student["name"]
            student["department"] = updated_student["department"]
            student["cgpa"] = updated_student["cgpa"]
            student["skills"] = updated_student["skills"]
            student["status"] = updated_student["status"]

            break

    with open(STUDENT_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({
        "message": "Student Updated Successfully"
    })
@prediction.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):

    with open(STUDENT_FILE, "r") as f:
        data = json.load(f)

    data = [
        student for student in data
        if student["id"] != student_id
    ]

    with open(STUDENT_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({
        "message": "Student Deleted Successfully"
    })
@prediction.route("/api/students", methods=["GET"])
def get_students():

    if not os.path.exists(STUDENT_FILE):

        with open(STUDENT_FILE, "w") as f:
            json.dump([], f)

    with open(STUDENT_FILE, "r") as f:
        data = json.load(f)

    return jsonify(data)
@prediction.route("/api/students", methods=["POST"])
def add_student():

    student = request.json

    if not os.path.exists(STUDENT_FILE):

        with open(STUDENT_FILE, "w") as f:
            json.dump([], f)

    with open(STUDENT_FILE, "r") as f:
        data = json.load(f)

    student["id"] = len(data) + 1

    data.append(student)

    with open(STUDENT_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({
        "message": "Student Added Successfully",
        "student": student
    })
# =======================================
# AI Placement Prediction
# =======================================

@prediction.route("/predict", methods=["POST"])
def predict_placement():

    data = request.json

    cgpa = float(data.get("cgpa", 0))
    aptitude = float(data.get("aptitude", 0))

    probability = (
        (cgpa * 10 * 0.6) +
        (aptitude * 0.4)
    )

    if probability > 100:
        probability = 100

    if probability >= 80:

        result = "High Placement Chance"

    elif probability >= 60:

        result = "Medium Placement Chance"

    else:

        result = "Need Skill Improvement"

    return jsonify({

        "probability": round(probability),

        "result": result

    })