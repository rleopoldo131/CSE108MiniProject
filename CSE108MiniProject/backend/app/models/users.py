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
    id = db.Column(db.Integer, primary_key=True)#setting user id 
    firstName = db.Column(db.String(50), nullable=False)#firstname of user
    lastName = db.Column(db.String(50), nullable=False)#last name of user
    username = db.Column(db.String(80), unique=True, nullable=False) #user username 
    password = db.Column(db.String(200), nullable=False) #user pass word inthe database
    role = db.Column(db.String(20), nullable=False)  # 'student', 'teacher', 'admin'
    courses = db.relationship('Course', secondary=student_courses, backref='students')#storing courses
    
    
    def __repr__(self):
        return f"<User {self.username}>"# returns a string (which Flask-Admin expects), not a tuple or a dictionary