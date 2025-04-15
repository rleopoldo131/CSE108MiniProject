from flask import Blueprint, request, jsonify
from app.models.grade import Grade
from app.models.course import Course,Enrollment
from app.database import db

bp = Blueprint("teacher_routes", __name__)

@bp.route("/teacher/courses", methods=["GET"])
def get_teacher_courses():
    teacher_id = request.args.get("teacher_id")
    if not teacher_id:
        return jsonify({"error": "Teacher ID is required"}), 400

    courses = Course.query.filter_by(teacher_id=teacher_id).all()
    if not courses:
        return jsonify({"message": "No courses found for this teacher"}), 404

    course_data = []
    for course in courses:
        students = [
            {
                "student_id": enrollment.student.id,
                "student_name": f"{enrollment.student.firstName} {enrollment.student.lastName}",
                "grade": enrollment.grade,
            }
            for enrollment in course.enrollments
        ]
        course_data.append({
            "course_id": course.id,
            "title": course.title,
            "students": students
        })

    return jsonify(course_data), 200
@bp.route("/grades", methods=["PUT"])
def update_student_grade():
    data = request.json
    student_id = data.get("student_id")
    course_id = data.get("course_id")
    new_grade = data.get("grade")

    if not all([student_id, course_id, new_grade]):
        return jsonify({"error": "Missing student_id, course_id, or grade"}), 400

    enrollment = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()
    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404

    enrollment.grade = new_grade
    db.session.commit()
    return jsonify({"message": "Grade updated successfully"}), 200