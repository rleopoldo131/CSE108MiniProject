from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from app.models.users import User
from app.database import db




bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    try:
        new_user = User(
            firstName=data['firstName'],
            lastName=data['lastName'],
            username=data['username'],
            password=generate_password_hash(data['password']),
            role=data['role']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(message="Registered successfully"), 201
    except Exception as e:
        print("Registration error:", e)
        return jsonify(message="Registration failed"), 400





@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify(username=user.username, role=user.role,firstName=user.firstName,lastName=user.lastName), 200
    return jsonify(message="Invalid credentials"), 401


# verify blueprint is working
@bp.route('/test', methods=['GET'])
def test():
    return jsonify(message="auth blueprint is working")