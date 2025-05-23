import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);//user courses array to hold data
  const navigate = useNavigate(); 

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
      const res = await axios.get("/api/student/courses", { headers });//access apo for their course associate to their user id
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
    <div>
      <button onClick={() => navigate("/studentpage")}>Back to Student Dashboard</button> 
      <h2>My Enrolled Courses</h2>
      {myCourses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <ul>
          {myCourses.map((course) => (
            <li key={course.id}>
              <strong>{course.title}</strong> — Professor: {course.teacher}<br />
              Time: {course.time}<br />
              Capacity: {course.capacity}{" "}
              <button onClick={() => handleDrop(course.id)}>Drop</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCourses;
