from flask import Blueprint, jsonify, request
import json
import os

prediction = Blueprint("prediction", __name__)

COMPANY_FILE = "companies.json"


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
@prediction.route("/companies/<int:index>", methods=["DELETE"])
def delete_company(index):

    with open(COMPANY_FILE, "r") as f:
        data = json.load(f)

    if index < len(data):
        data.pop(index)

    with open(COMPANY_FILE, "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({
        "message": "Company Deleted Successfully"
    })