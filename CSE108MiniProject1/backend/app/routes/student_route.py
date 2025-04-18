#for enrolling in a course

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.users import User
from app.models.course import Course
from app import db

bp = Blueprint("student_route", __name__)



@bp.route("/courses/all", methods=["GET"])
@jwt_required()
def get_all_courses():
    user_id = get_jwt_identity()
    print("JWT identity (user_id):", user_id)

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "capacity": c.capacity,
            "enrolled": len(c.students),
            "teacher": f"{c.teacher.firstName} {c.teacher.lastName}" if c.teacher else "Unassigned",
            "time": c.time or "TBD"


        }
        for c in Course.query.all()
    ]), 200



@bp.route("/student/courses", methods=["GET"])
@jwt_required()
def get_student_courses():
    print("✅ BACKEND: hit get_student_courses()")

    student_id = int(get_jwt_identity())  # 
    print("JWT user ID (from /student/courses):", student_id)

    student = User.query.get(student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    enrolled_courses = student.courses
    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "capacity": c.capacity,
            "teacher": f"{c.teacher.firstName} {c.teacher.lastName}" if c.teacher else "Unassigned",
            "time": c.time or "TBD"
        } for c in enrolled_courses
    ]), 200



@bp.route("/student/enroll", methods=["POST"])
@jwt_required()
def enroll_in_course():
    data = request.get_json()
    course_id = data.get("course_id")
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


@bp.route("/student/drop", methods=["POST"])
@jwt_required()
def drop_course():
    data = request.get_json()
    course_id = data.get("course_id")
    user_id = get_jwt_identity()
    student = User.query.get(user_id)
    course = Course.query.get(course_id)

    if course in student.courses:
        student.courses.remove(course)
        db.session.commit()
        return jsonify({"msg": "Dropped course"}), 200
    return jsonify({"msg": "Not enrolled in this course"}), 400