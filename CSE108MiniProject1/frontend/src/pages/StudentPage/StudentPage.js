import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import ucmLogo from "../../assets/Uc_merced_logo.png";
import "./StudentPage.css";

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
    <div className="student-wrapper">
      <div className="student-card">
        <img src={ucmLogo} alt="UC Merced Logo" className="student-logo center-logo" />
        <h1 className="student-title">Student Dashboard</h1>
        <p className="student-subtitle">Welcome, {user?.firstName || "Student"}!</p>

        <div className="student-links">
          <Link to="/studentpage/mycourses" className="student-link">View My Courses</Link>
          <Link to="/studentpage/available" className="student-link">View Available Courses</Link>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
};

export default StudentPage;
