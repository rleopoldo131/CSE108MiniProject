# models/course.py

from app.database import db
from app.models.users import User

enrollment = db.Table(
    'enrollment',
    db.Column('student_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

class Course(db.Model):
    __tablename__ = "course"
    id = db.Column(db.Integer, primary_key=True)#setting id column in db
    title = db.Column(db.String(100))#setting the title of course
    capacity = db.Column(db.Integer)#showing class size i db
    time = db.Column(db.String(50))#showing shcdule of class
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))#showing teacher id for each course
    teacher = db.relationship('User', foreign_keys=[teacher_id])#showing relationship between techer and teacher_id
    students = db.relationship(
        "User",
        secondary=enrollment,
        backref="enrolled_courses"
    )

    grades = db.relationship("Grade", backref="course")
