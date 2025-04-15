# models/course.py

from app.database import db

# enrollments = db.Table('enrollments',
#     db.Column('student_id', db.Integer, db.ForeignKey('user.id')),
#     db.Column('course_id', db.Integer, db.ForeignKey('course.id'))
# )
class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
    grade = db.Column(db.String(5))

    # Relationships
    student = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    # If teacher functionality is needed later
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    teacher = db.relationship('User', back_populates='courses_taught')
    enrollments = db.relationship('Enrollment', back_populates='course', cascade="all, delete-orphan")
    # Relationship to students enrolled
    # students = db.relationship('User', secondary=enrollments, backref='enrolled_courses')
