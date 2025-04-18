import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./AvailableCourses.css";

const AvailableCourses = () => {
  const [allCourses, setAllCourses] = useState([]);//data holding all courses in database
  const [enrolledIds, setEnrolledIds] = useState([]);//data for all ids for specfic user enrolled courses
  const [messages, setMessages] = useState({}); 
  const navigate = useNavigate(); //navigating function call
  const [searchTerm, setSearchTerm] = useState("");//searching use state for courses

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. User may not be logged in.");
      return;
    }

    try {
      const [allRes, myRes] = await Promise.all([//gettign data from api/course for all courses in database
        axios.get("/api/courses/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }),
        axios.get("/api/student/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      ]);

      setAllCourses(allRes.data);//set data into use state
      const myCourseIds = myRes.data.map((course) => course.id);
      setEnrolledIds(myCourseIds);//set data into enrolled id
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post("/api/student/enroll", { course_id: courseId }, { headers });
      setMessages((prev) => ({ ...prev, [courseId]: "" })); // clear this course's message
      fetchData();
    } catch (err) {
      console.error("Failed to enroll:", err);
      const msg = err.response?.data?.msg || "Enrollment failed.";
      setMessages((prev) => ({ ...prev, [courseId]: msg }));
    }
  };

  const handleDrop = async (courseId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post("/api/student/drop", { course_id: courseId }, { headers });
      setMessages((prev) => ({ ...prev, [courseId]: "" })); // clear message for this course
      fetchData();
    } catch (err) {
      console.error("Failed to drop course:", err);
      const msg = err.response?.data?.msg || "Drop failed.";
      setMessages((prev) => ({ ...prev, [courseId]: msg }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="courses-wrapper">
      <div className="courses-card">
        <button className="back-to-dashboard-btn" onClick={() => navigate("/studentpage")}>
          Back to Student Dashboard
        </button>
  
        <h2>All Courses</h2>
  
        <input
          type="text"
          className="course-search"
          placeholder="Search by course title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
  
        {allCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <ul className="course-list">
            {allCourses
              .filter((course) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course) => {
                const isEnrolled = enrolledIds.includes(course.id);
                return (
                  <li key={course.id}>
                    <strong>{course.title}</strong> — Professor: {course.teacher || "Unassigned"}<br />
                    Time: {course.time || "TBD"}<br />
                    Enrolled: {course.enrolled}/{course.capacity}<br />
                    {isEnrolled ? (
                      <button onClick={() => handleDrop(course.id)}>Drop</button>
                    ) : (
                      <button onClick={() => handleEnroll(course.id)}>Enroll</button>
                    )}
                    {messages[course.id] && (
                      <p style={{ color: "red", margin: 0 }}>{messages[course.id]}</p>
                    )}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );  
};

export default AvailableCourses;
