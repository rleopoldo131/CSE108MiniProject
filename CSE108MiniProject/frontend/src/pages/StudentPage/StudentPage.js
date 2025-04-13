import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

const StudentPage = () => {
  const navigate = useNavigate();

  let user = null;
  const storedUser = localStorage.getItem("user");
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.warn("Invalid 'user' in localStorage");
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="page-container">
      <div className="page-container2">
        <h1>Student Dashboard</h1>
        <p>Welcome, {user?.firstName || "Student"}!</p>

        <h3><Link to="/studentpage/mycourses">View My Courses</Link></h3>
        <h3><Link to="/studentpage/available">View Available Courses</Link></h3>
      </div>
      <LogoutButton />
    </div>
  );
};

export default StudentPage;
