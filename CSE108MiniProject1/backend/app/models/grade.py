# app/models/grade.py

from app.database import db

class Grade(db.Model):
    __tablename__ = "grade"
    id = db.Column(db.Integer, primary_key=True)#making user id column in database
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)#studnet id column
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)# course id column
    grade = db.Column(db.String(5))  # like "A", "B+", etc.
    student = db.relationship("User", foreign_keys=[student_id])#relationship between student
    course = db.relationship("Course", foreign_keys=[course_id])#relationship of course id with courses
