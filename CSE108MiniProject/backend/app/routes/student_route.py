#for enrolling in a course

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.users import User
from app.models.course import Course, enrollments
from app import db

bp = Blueprint("student_route", __name__)

@bp.route("/courses", methods=["GET"])
@jwt_required()
def get_all_courses():
    courses = Course.query.all()
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "capacity": c.capacity,
        "enrolled": len(c.students)
    } for c in courses]), 200


@bp.route("/student/courses", methods=["GET"])
@jwt_required()
def get_my_courses():
    user_id = get_jwt_identity()
    student = User.query.get(user_id)
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "capacity": c.capacity
    } for c in student.enrolled_courses]), 200


@bp.route("/student/enroll/<int:course_id>", methods=["POST"])
@jwt_required()
def enroll_in_course(course_id):
    user_id = get_jwt_identity()
    student = User.query.get(user_id)
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"msg": "Course not found"}), 404

    if student in course.students:
        return jsonify({"msg": "Already enrolled"}), 400

    if len(course.students) >= course.capacity:
        return jsonify({"msg": "Course is full"}), 400

    course.students.append(student)
    db.session.commit()
    return jsonify({"msg": "Enrolled successfully"}), 200
