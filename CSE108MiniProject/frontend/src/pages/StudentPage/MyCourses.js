import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);

  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. User may not be logged in.");
      return;
    }

    const headers = {
    
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.get("/api/student/courses", { headers });
      setMyCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch my courses:", err);
    }
  };

  const handleDrop = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/student/drop",
        { course_id: courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMyCourses(); // refresh after drop
    } catch (err) {
      console.error("Failed to drop course:", err);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div>
      <h2>My Enrolled Courses</h2>
      {myCourses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <ul>
          {myCourses.map((course) => (
            <li key={course.id}>
              {course.title} (Capacity: {course.capacity}){" "}
              <button onClick={() => handleDrop(course.id)}>Drop</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCourses;
