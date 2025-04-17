from app.database import db

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    grade = db.Column(db.Float, nullable=False)
    
    def to_dict(self):
        return {"id": self.id, "name": self.name, "grade": self.grade}
