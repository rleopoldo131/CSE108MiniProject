from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'student', 'teacher', 'admin'

    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete")
    courses_taught = relationship("Course", back_populates="teacher")

class Course(Base):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    teacher_id = Column(Integer, ForeignKey('users.id'))

    teacher = relationship("User", back_populates="courses_taught")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete")

class Enrollment(Base):
    __tablename__ = 'enrollments'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('users.id'))
    course_id = Column(Integer, ForeignKey('courses.id'))
    grade = Column(String)

    __table_args__ = (UniqueConstraint('student_id', 'course_id', name='uix_student_course'),)

    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
