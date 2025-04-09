import os

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
SQLALCHEMY_DATABASE_URI = "sqlite:///grades.db"
SQLALCHEMY_TRACK_MODIFICATIONS = False
