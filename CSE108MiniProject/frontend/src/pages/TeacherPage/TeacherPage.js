import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

function TeacherPage() {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState({});
  const [editing, setEditing] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/teacher/courses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(res.data);

        const initialGrades = {};
        const initialEditing = {};
        res.data.forEach((course) => {
          course.students.forEach((student) => {
            const key = `${student.id}-${course.id}`;
            initialGrades[key] = student.grade || "";
            initialEditing[key] = false;
          });
        });

        setGrades(initialGrades);
        setEditing(initialEditing);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
      });
  }, []);

  const handleGradeChange = (studentId, courseId, value) => {
    setGrades((prev) => ({
      ...prev,
      [`${studentId}-${courseId}`]: value,
    }));
  };

  const submitGrade = (studentId, courseId) => {
    const token = localStorage.getItem("token");
    const key = `${studentId}-${courseId}`;
    const gradeValue = grades[key];

    axios
      .post(
        "http://localhost:5000/api/teacher/grade",
        {
          student_id: studentId,
          course_id: courseId,
          grade: gradeValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Grade submitted");
        setEditing((prev) => ({ ...prev, [key]: false }));
      })
      .catch((err) => console.error("Submit error:", err));
  };

  return (
    <div className="page-container">
      <h1>Your Assigned Courses</h1>

      {/* Courses Table */}
      <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Time</th>
            <th>Capacity</th>
            <th>Enrolled Students</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.time}</td>
              <td>{course.students.length}/{course.capacity}</td>
              <td>
                <button
                  onClick={() => {
                    const updatedCourses = courses.map((c) =>
                      c.id === course.id
                        ? { ...c, showStudents: !c.showStudents }
                        : c
                    );
                    setCourses(updatedCourses);
                  }}
                >
                  {course.showStudents ? "Hide Students" : "Show Students"}
                </button>
                {course.showStudents && (
                  <table border="1" style={{ width: "100%", marginTop: "10px" }}>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Grade</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.students.map((student) => {
                        const key = `${student.id}-${course.id}`;
                        const isEditing = editing[key];

                        return (
                          <tr key={student.id}>
                            <td>
                              {student.firstName} {student.lastName}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  placeholder="Grade"
                                  value={grades[key] || ""}
                                  onChange={(e) =>
                                    handleGradeChange(
                                      student.id,
                                      course.id,
                                      e.target.value
                                    )
                                  }
                                  style={{ marginLeft: "10px" }}
                                />
                              ) : (
                                <strong>{grades[key] || "No grade"}</strong>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <button
                                  onClick={() => submitGrade(student.id, course.id)}
                                  style={{ marginLeft: "5px" }}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditing((prev) => ({
                                      ...prev,
                                      [key]: true,
                                    }))
                                  }
                                  style={{ marginLeft: "10px" }}
                                >
                                  Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <LogoutButton />
    </div>
  );
}

export default TeacherPage;
