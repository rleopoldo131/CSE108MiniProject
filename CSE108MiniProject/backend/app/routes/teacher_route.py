# app/routes/teacher_route.py

from flask import Blueprint, jsonify,request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.users import User
from app.models.course import Course
from app.models.grade import Grade  # 
from app import db
bp = Blueprint("teacher_route", __name__)

@bp.route("/teacher/courses", methods=["GET"])
@jwt_required()
def get_teacher_courses():
    teacher_id = int(get_jwt_identity())
    teacher = User.query.get(teacher_id)

    if not teacher or teacher.role != "teacher":
        return jsonify({"msg": "Unauthorized"}), 403

    courses = Course.query.filter_by(teacher_id=teacher_id).all()
    return jsonify([
        {
            "id": course.id,
            "title": course.title,
            "capacity": course.capacity,
            "time": course.time,
            "students": [
                {
                    "id": student.id,
                    "firstName": student.firstName,
                    "lastName": student.lastName,
                    "username": student.username,
                      "grade": next(
                              (g.grade for g in Grade.query.filter_by(course_id=course.id, student_id=student.id)), None
                      )
                }
                for student in course.students
            ]
        } for course in courses
    ])






@bp.route("/teacher/grade", methods=["POST"])
@jwt_required()
def assign_grade():
    data = request.get_json()
    teacher_id = int(get_jwt_identity())

    # Validate that course belongs to teacher
    course = Course.query.get(data["course_id"])
    if not course or course.teacher_id != teacher_id:
        return jsonify({"msg": "Unauthorized to grade this course"}), 403

    # Check if grade already exists
    existing_grade = Grade.query.filter_by(
        student_id=data["student_id"],
        course_id=data["course_id"]
    ).first()

    if existing_grade:
        existing_grade.grade = data["grade"]
    else:
        new_grade = Grade(
            student_id=data["student_id"],
            course_id=data["course_id"],
            grade=data["grade"]
        )
        db.session.add(new_grade)

    db.session.commit()
    return jsonify({"msg": "Grade updated successfully"}), 200