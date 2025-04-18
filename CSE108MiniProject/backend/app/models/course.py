# models/course.py

from app.database import db
from app.models.users import User

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)#setting id column in db
    title = db.Column(db.String(100))#setting the title of course
    capacity = db.Column(db.Integer)#showing class size i db
    time = db.Column(db.String(50))#showing shcdule of class
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))#showing teacher id for each course
    teacher = db.relationship('User', foreign_keys=[teacher_id])#showing relationship between techer and teacher_id