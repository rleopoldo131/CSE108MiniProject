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

def create_app():
    app = Flask(
        __name__,
        template_folder=os.path.abspath('../../frontend/templates'),
        static_folder=os.path.abspath('../../frontend/static')
    )

    app.config.from_pyfile('../../config.py')

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
