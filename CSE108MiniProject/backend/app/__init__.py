
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from flask_cors import CORS
from app.database import db
from app.routes.teacher_route import bp as teacher_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    
    CORS(app) #allows our react frontend to make request to our backend

    db.init_app(app)
    app.register_blueprint(teacher_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()
        
    @app.route("/")
    def hello():
        return "Flask backend is running."

    return app