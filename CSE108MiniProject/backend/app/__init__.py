
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from flask_cors import CORS

from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from app.models.users import User  #
from app.models.grade import Grade
from app.database import db


from app.routes.teacher_route import bp as teacher_bp
from app.routes.auth import bp as auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    
    CORS(app) #allows our react frontend to make request to our backend

    db.init_app(app)
   
   
    app.register_blueprint(teacher_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    
    admin = Admin(app, name="Admin Panel", template_mode="bootstrap3")
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Grade, db.session))

    with app.app_context():
        db.create_all()
    # Flask-Admin inside the app context
  

        
    @app.route("/")
    def hello():
        return "Flask backend is running."

    return app