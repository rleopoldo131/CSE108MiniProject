import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import "./TeacherPage.css";

function TeacherPage() {
  const [courses, setCourses] = useState([]);//use state to store all courses for teacher id is associated to
  const [grades, setGrades] = useState({});// use state for grades for their students in course
  const [editing, setEditing] = useState({});// use state for edit state  of info in the teacher web app
  const [studentSearch, setStudentSearch] = useState("");//use state for when searching for student 
  let user = null;
  const storedUser = localStorage.getItem("user");
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.warn("Invalid 'user' in localStorage");
  }


  useEffect(() => {
    const token = localStorage.getItem("token");//grabs token for access of teacher page
    axios
      .get("http://127.0.0.1:5000/api/teacher/courses", {//calling api
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourses(res.data);//put all courses teacher associate into use state 

        const initialGrades = {};
        const initialEditing = {};
        res.data.forEach((course) => {//for each coruse store the student and their grade into the usestate 
          course.students.forEach((student) => {
            const key = `${student.id}-${course.id}`;
            initialGrades[key] = student.grade || "";
            initialEditing[key] = false;
          });
        });

        setGrades(initialGrades);//store grades 
        setEditing(initialEditing);//store edit boolean
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
      });
  }, []);

  const handleGradeChange = (studentId, courseId, value) => {//when grade is change find associoated id then get new values
    setGrades((prev) => ({
      ...prev,
      [`${studentId}-${courseId}`]: value,
    }));
  };

  const submitGrade = (studentId, courseId) => {//submit chnages of new grade
    const token = localStorage.getItem("token");
    const key = `${studentId}-${courseId}`;
    const gradeValue = grades[key];

    axios
      .post(
        "http://127.0.0.1:5000/api/teacher/grade",
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
    <div className="teacher-wrapper">
      <div className="teacher-card">
        <h1 className="teacher-title">Your Assigned Courses</h1>
        <p className="teacher-subtitle">Welcome, {user?.firstName || "Teacher"}!</p>
        <table className="teacher-table">
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
                <td>
                  {course.students.length}/{course.capacity}
                </td>
                <td>
                  <button
                    className="action-button"
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
                    <>
                      <input
                        type="text"
                        className="student-search"
                        placeholder="Search students by name..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                      <table className="teacher-table" style={{ marginTop: "10px" }}> {/* edit */}
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Grade</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.students
                            .filter((student) => {
                              const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                              return fullName.includes(studentSearch.toLowerCase());
                            })
                            .map((student) => {
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
                                        className="grade-button"
                                        onClick={() => submitGrade(student.id, course.id)}
                                      >
                                        Save
                                      </button>
                                    ) : (
                                      <button
                                        className="action-button"
                                        onClick={() =>
                                          setEditing((prev) => ({
                                            ...prev,
                                            [key]: true,
                                          }))
                                        }
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
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <LogoutButton />
      </div>
    </div>
  );
}

export default TeacherPage;