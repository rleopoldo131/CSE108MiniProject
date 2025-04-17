# app/models/grade.py

from app.database import db

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    grade = db.Column(db.String(5))  # like "A", "B+", etc.

    student = db.relationship("User", foreign_keys=[student_id])
    course = db.relationship("Course", foreign_keys=[course_id])
