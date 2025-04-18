// components/LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css"; // Import CSS file for styling
const LogoutButton = () => { //how logout function operates
  const navigate = useNavigate(); //naviagtion 

  const handleLogout = () => {
    localStorage.removeItem("user");//remove from storage to register no user on web app 
    navigate("/");
  };

  return <button onClick={handleLogout}>Logout</button>;//button for logout
};

export default LogoutButton;