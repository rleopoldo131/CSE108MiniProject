# app/models/user.py

from app.database import db
#=from flask_sqlalchemy import SQLAlchemy

#db = SQLAlchemy()  

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    
    
    username = db.Column(db.String(80), unique=True, nullable=False)
    
    password = db.Column(db.String(200), nullable=False)  # hash this
    role = db.Column(db.String(20), nullable=False)  # 'student', 'teacher', 'admin'
    def __repr__(self):
        return f"<User {self.username}>"# returns a string (which Flask-Admin expects), not a tuple or a dictionary
