from flask import Blueprint, request, jsonify
from app.models.grade import Grade
from app.database import db

bp = Blueprint("teacher_routes", __name__)

@bp.route("/grades", methods=["GET"])
def get_grades():
    return jsonify([g.to_dict() for g in Grade.query.all()])

@bp.route("/grades/<name>", methods=["GET"])
def get_grade(name):
    grade = Grade.query.filter_by(name=name).first()
    if grade:
        return jsonify(grade.to_dict())
    return jsonify({"error": "Student not found"}), 404

@bp.route("/grades", methods=["POST"])
def add_grade():
    data = request.json
    if not data.get("name") or data.get("grade") is None:
        return jsonify({"error": "Missing data"}), 400
    new_grade = Grade(name=data["name"], grade=data["grade"])
    db.session.add(new_grade)
    db.session.commit()
    return jsonify({"message": "Grade added"}), 201

@bp.route("/grades/<name>", methods=["PUT"])
def update_grade(name):
    student = Grade.query.filter_by(name=name).first()
    if not student:
        return jsonify({"error": "Student not found"}), 404
    student.grade = request.json["grade"]
    db.session.commit()
    return jsonify({"message": "Grade updated"})

@bp.route("/grades/<name>", methods=["DELETE"])
def delete_grade(name):
    student = Grade.query.filter_by(name=name).first()
    if not student:
        return jsonify({"error": "Student not found"}), 404
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": "Grade deleted"})