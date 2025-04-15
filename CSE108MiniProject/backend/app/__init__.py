import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from flask_cors import CORS
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from wtforms import PasswordField
from wtforms.fields import SelectField
from wtforms.validators import DataRequired
from flask_admin.form import SecureForm
from werkzeug.security import generate_password_hash
from flask_jwt_extended import JWTManager

from app.models.users import User
from app.models.grade import Grade
from app.models.course import Course
from app.database import db

from app.routes.teacher_route import bp as teacher_bp
from app.routes.auth import bp as auth_bp
from app.routes.student_route import bp as student_bp


class NoHomeAdminView(AdminIndexView):
    def is_visible(self):
        return False


class UserAdmin(ModelView):
    form_base_class = SecureForm

    form_overrides = {
        'password': PasswordField,
        'role': SelectField
    }

    form_args = {
        'username': dict(label='Username', validators=[DataRequired()]),
        'password': dict(label='Password', validators=[DataRequired()]),
        'role': {
            'choices': [('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')],
            'label': 'Role',
            'validators': [DataRequired()]
        },
        'firstName': dict(label='First Name', validators=[DataRequired()]),
        'lastName': dict(label='Last Name', validators=[DataRequired()])
    }

    column_exclude_list = ['password']
    column_labels = {
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'username': 'Username',
        'role': 'Role'
    }

    def on_model_change(self, form, model, is_created):
        raw_pw = form.password.data
        if raw_pw and not raw_pw.startswith("pbkdf2:"):
            model.password = generate_password_hash(raw_pw)


class CourseAdmin(ModelView):
    form_columns = ['title', 'capacity', 'time', 'teacher']
    column_list = ['title', 'capacity', 'time', 'teacher']



    def scaffold_form(self):
        form_class = super().scaffold_form()

        # Only show users with role = 'teacher'
        form_class.teacher.query_factory = lambda: User.query.filter_by(role='teacher').all()

        return form_class



def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app, supports_credentials=True, expose_headers=["Authorization"], allow_headers=["Authorization", "Content-Type"])
    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(teacher_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(student_bp, url_prefix="/api")

    admin = Admin(
        app,
        name="Admin Panel",
        template_mode="bootstrap3",
        index_view=NoHomeAdminView()
    )
    admin.add_view(UserAdmin(User, db.session))
    admin.add_view(ModelView(Grade, db.session))
    admin.add_view(CourseAdmin(Course, db.session))

    with app.app_context():
        db.create_all()

    @app.route("/")
    def hello():
        return "Flask backend is running."

    return app