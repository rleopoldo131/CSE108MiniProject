# models/course.py

from app.database import db
from app.models.users import User

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    capacity = db.Column(db.Integer)
    time = db.Column(db.String(50))

    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    teacher = db.relationship('User', foreign_keys=[teacher_id])