import React, { useState, useEffect } from 'react';
import './TeacherPage.css';
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import axios from 'axios';

const TeacherPage = () => {
  const [myCourses, setMyCourses] = useState([]);

  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token);
    
    if (!token) {
      console.warn("No token found. User may not be logged in.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.get("/api/teacher/courses", { headers });
      setMyCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch my courses:", err);
      alert("Could not fetch courses. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div className="container">
      <h1>My Courses</h1>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Teacher</th>
            <th>Time</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {myCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.teacher}</td>
              <td>{course.time}</td>
              <td>{course.capacity}</td>
              <td>

                
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
