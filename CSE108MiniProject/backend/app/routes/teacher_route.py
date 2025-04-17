from flask import Blueprint, request, jsonify
from app.models.grade import Grade
from app.database import db
from app.models.users import User
from app.models.course import Course
from flask_jwt_extended import create_access_token, create_refresh_token,jwt_required, get_jwt_identity

bp = Blueprint("teacher_routes", __name__)


@bp.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()  # Get the current user from the refresh token
    new_access_token = create_access_token(identity=current_user)  # Create a new access token
    return jsonify(access_token=new_access_token), 200
@bp.route("/teacher/courses", methods=["GET"])
@jwt_required()
def get_teacher_courses():
    print("✅ Backend: hit get_teacher_courses()")

    teacher_id = get_jwt_identity()
    print(f"JWT user ID: {teacher_id}")

    from sqlalchemy.orm import joinedload
    teacher = User.query.options(joinedload(User.teaching_courses)).get(teacher_id)

    if not teacher:
        return jsonify({"msg": "Teacher not found"}), 404

    teaching_courses = teacher.teaching_courses
    print(f"Teaching course titles: {[c.title for c in teaching_courses]}")

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "teacher": f"{c.teacher.firstName} {c.teacher.lastName}" if c.teacher else "Unassigned",
            "time": c.time or "TBD",
            "capacity": c.capacity or "N/A"
        } for c in teaching_courses
    ]), 200
@bp.route("/teacher/courses/<int:course_id>/roster", methods=["GET"])
@jwt_required()
def get_course_roster(course_id):
    teacher_id = get_jwt_identity()

    course = Course.query.filter_by(id=course_id, teacher_id=teacher_id).first()

    if not course:
        return jsonify({"error": "Course not found or not taught by you"}), 404

    students = course.students  # This should be a list of enrolled students

    # Prepare the roster data
    roster = []
    for student in students:
        # If the student's grade is null, set it to an empty string
        grade = student.grade if student.grade is not None else ""

        roster.append({
            "id": student.id,
            "firstName": student.firstName,
            "lastName": student.lastName,
            "grade": grade  # Now we send grade as an empty string if it's null
        })

    return jsonify(roster), 200
