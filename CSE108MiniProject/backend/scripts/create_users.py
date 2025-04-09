import os
import sys

# This adds the backend folder to the Python import path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Base, User
from app.database import engine, Session
from werkzeug.security import generate_password_hash

Base.metadata.create_all(engine)
session = Session()

student = User(username="mindy", password=generate_password_hash("1234"), role="student")
teacher = User(username="drhepworth", password=generate_password_hash("abcd"), role="teacher")
admin = User(username="admin", password=generate_password_hash("admin123"), role="admin")

session.add_all([student, teacher, admin])
session.commit()
session.close()
print("Users created!")
