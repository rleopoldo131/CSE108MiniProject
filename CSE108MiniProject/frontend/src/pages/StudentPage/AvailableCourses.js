import React, { useEffect, useState } from "react";
import axios from "axios";

const AvailableCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [messages, setMessages] = useState({});

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. User may not be logged in.");
      return;
    }

    try {
      const [allRes, myRes] = await Promise.all([
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

      setAllCourses(allRes.data);
      const myCourseIds = myRes.data.map((course) => course.id);
      setEnrolledIds(myCourseIds);
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
    <div>
      <h2>All Courses</h2>
      {allCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul>
          {allCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <li key={course.id}>
                <strong>{course.title}</strong> — Professor: {course.teacher || "Unassigned"}<br />
                Time: {course.time || "TBD"}<br />
                Enrolled: {course.enrolled}/{course.capacity}{" "}
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
  );
};

export default AvailableCourses;