# models/course.py

from app.database import db

enrollments = db.Table('enrollments',
    db.Column('student_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    # If teacher functionality is needed later
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Relationship to students enrolled
    students = db.relationship('User', secondary=enrollments, backref='enrolled_courses')
