from flask import Flask, send_file, request, jsonify
from models import Student, Base
from database import engine, Session

app = Flask(__name__)
Base.metadata.create_all(engine)  # creates the table

# Serve the HTML file
@app.route('/')
def serve_html():
    return send_file('grades.html')

# Serve the JavaScript file
@app.route('/script.js')
def serve_js():
    return send_file('script.js')

# Serve the CSS file
@app.route('/styles.css')
def serve_css():
    return send_file('styles.css')

# Get all grades
@app.route('/grades', methods=['GET'])
def get_grades():
    session = Session()
    students = session.query(Student).all()
    result = {s.name: s.grade for s in students}
    session.close()
    return jsonify(result)

@app.route('/grades/<name>', methods=['GET'])
def get_grade_by_name(name):
    session = Session()
    student = session.query(Student).filter_by(name=name).first()
    session.close()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    return jsonify({"name": student.name, "grade": student.grade})


# Add a new grade
@app.route('/grades', methods=['POST'])
def add_grade():
    data = request.json
    name = data.get('name')
    grade = data.get('grade')

    if not name or grade is None:
        return jsonify({"error": "Invalid data"}), 400

    session = Session()
    existing = session.query(Student).filter_by(name=name).first()
    if existing:
        session.close()
        return jsonify({"error": "Student already exists"}), 400

    student = Student(name=name, grade=grade)
    session.add(student)
    session.commit()
    session.close()
    return jsonify({"message": "Grade added successfully"}), 201

# Edit a grade
@app.route('/grades/<name>', methods=['PUT'])
def update_grade(name):
    data = request.json
    new_grade = data.get('grade')

    if new_grade is None:
        return jsonify({"error": "Invalid data"}), 400

    session = Session()
    student = session.query(Student).filter_by(name=name).first()
    if not student:
        session.close()
        return jsonify({"error": "Student not found"}), 404

    student.grade = new_grade
    session.commit()
    session.close()
    return jsonify({"message": "Grade updated successfully"})

# Delete a grade
@app.route('/grades/<name>', methods=['DELETE'])
def delete_grade(name):
    session = Session()
    student = session.query(Student).filter_by(name=name).first()
    if not student:
        session.close()
        return jsonify({"error": "Student not found"}), 404

    session.delete(student)
    session.commit()
    session.close()
    return jsonify({"message": "Grade deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)



