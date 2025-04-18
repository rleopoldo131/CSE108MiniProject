import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./MyCourses.css";

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);//user courses array to hold data
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState("");//use state for searching 


  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");//token for user access
    if (!token) {
      console.warn("No token found. User may not be logged in.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.get("/api/student/courses", { headers });//access api for their course associate to their user id
      setMyCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch my courses:", err);
    }
  };

  const handleDrop = async (courseId) => {//handle droping a course taking course off database of mycourses
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/student/drop",
        { course_id: courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMyCourses(); 
    } catch (err) {
      console.error("Failed to drop course:", err);
    }
  };

  useEffect(() => {
    fetchMyCourses();//calling to get all courses user enrolled into
  }, []);

  return (
    <div className="courses-wrapper">
      <div className="courses-card">
        <button className="back-to-dashboard-btn" onClick={() => navigate("/studentpage")}>
          Back to Student Dashboard
        </button>

        <h2>My Enrolled Courses</h2>

        <input
          type="text"
          className="course-search"
          placeholder="Search my courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {myCourses.length === 0 ? (
          <p>You are not enrolled in any courses.</p>
        ) : (
          <ul className="course-list">
            {myCourses
              .filter((course) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course) => (
                <li key={course.id}>
                  <strong>{course.title}</strong> — Professor: {course.teacher}<br />
                  Time: {course.time}<br />
                  Capacity: {course.capacity}<br />
                  Grade: <strong>{course.grade || "N/A"}</strong><br />
                  <button onClick={() => handleDrop(course.id)}>Drop</button>
                </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );  
};

export default MyCourses;
