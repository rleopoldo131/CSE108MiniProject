import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from .database import engine
from .models import Base
from .admin_panel import init_admin

db = SQLAlchemy()
login_manager = LoginManager()


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'frontend', 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'frontend', 'static')

def create_app():
    app = Flask(
        __name__,
        template_folder=TEMPLATE_DIR,
        static_folder=STATIC_DIR
    )

    app.config.from_pyfile(os.path.join(BASE_DIR, 'config.py'))

    db.init_app(app)
    login_manager.init_app(app)
    CORS(app)

    from .routes import auth, student, teacher
    app.register_blueprint(auth.bp)
    app.register_blueprint(student.bp)
    app.register_blueprint(teacher.bp)

    with app.app_context():
        Base.metadata.create_all(bind=engine)

    init_admin(app)

    return app
