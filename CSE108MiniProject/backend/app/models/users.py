# app/models/user.py

from app.database import db
# from app.models.course import Course, enrollments
#=from flask_sqlalchemy import SQLAlchemy

#db = SQLAlchemy()  

student_courses = db.Table('student_courses',
    db.Column('student_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False) 
    password = db.Column(db.String(200), nullable=False)  # hash this
    role = db.Column(db.String(20), nullable=False)  # 'student', 'teacher', 'admin'
    teaching_courses = db.relationship("Course", back_populates="teacher", foreign_keys="Course.teacher_id")

    courses = db.relationship('Course', secondary=student_courses, backref='students')
    # enrollments = db.relationship('Enrollment', back_populates='student', cascade='all, delete-orphan')
    # courses_taught = db.relationship('Course', back_populates='teacher')

    
    def __repr__(self):
        return f"<User {self.username}>"# returns a string (which Flask-Admin expects), not a tuple or a dictionary