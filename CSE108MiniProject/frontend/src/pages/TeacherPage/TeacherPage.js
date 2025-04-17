import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

function TeacherPage() {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState({});
  const [editing, setEditing] = useState({}); // 

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
        //  Exit edit mode
        setEditing((prev) => ({ ...prev, [key]: false }));
      })
      .catch((err) => console.error("Submit error:", err));
  };

  return (
    <div className="page-container">
      <h1>Your Assigned Courses</h1>
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <h3>
            {course.title} ({course.time})
          </h3>
          <p>Capacity: {course.capacity}</p>
          <h4>Enrolled Students:</h4>
          <ul>
            {course.students.length === 0 ? (
              <li>No students enrolled</li>
            ) : (
              course.students.map((student) => {
                const key = `${student.id}-${course.id}`;
                const isEditing = editing[key];

                return (
                  <li key={student.id}>
                    {student.firstName} {student.lastName} ({student.username}){" "}
                    {isEditing ? (
                      <>
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
                        <button
                          onClick={() => submitGrade(student.id, course.id)}
                          style={{ marginLeft: "5px" }}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <strong style={{ marginLeft: "10px" }}>
                          {grades[key] || "No grade"}
                        </strong>
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
                      </>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ))}
      <LogoutButton />
    </div>
  );
}

export default TeacherPage;
