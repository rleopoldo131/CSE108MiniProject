// components/LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css"; // Import your CSS file for styling

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;