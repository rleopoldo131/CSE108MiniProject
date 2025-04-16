from flask import Blueprint, request, jsonify
from app.models.grade import Grade
from app.database import db
from app.models.users import User
from app.models.course import Course
from flask_jwt_extended import create_access_token, create_refresh_token,jwt_required, get_jwt_identity

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
@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()  # Get the current user from the refresh token
    new_access_token = create_access_token(identity=current_user)  # Create a new access token
    return jsonify(access_token=new_access_token), 200
@bp.route("/teacher/courses", methods=["GET"])
@jwt_required()
def get_teacher_courses():
    # Add debugging log to confirm route was hit
    print("✅ Backend: hit get_teacher_courses()")

    # Get the user ID from the JWT token
    print(f"Headers: {request.headers}")
    teacher_id = get_jwt_identity()  # Retrieves the user ID from the JWT token
    print(f"JWT user ID: {teacher_id}")

    # Retrieve the teacher from the database
    teacher = User.query.get(teacher_id)
    if not teacher:
        print("Teacher not found!")
        return jsonify({"msg": "Teacher not found"}), 404

    # Retrieve the courses associated with this teacher
    enrolled_courses = teacher.courses
    print(f"Enrolled courses: {enrolled_courses}")

    # Return the list of courses
    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "teacher": f"{c.teacher.firstName} {c.teacher.lastName}" if c.teacher else "Unassigned",
            "time": c.time or "TBD"
        } for c in enrolled_courses
    ]), 200
