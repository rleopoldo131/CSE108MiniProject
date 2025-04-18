import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button1 from "../../components/Button1/Button1";
import "./Register.css"; // Import your CSS file for styling
import ucmLogo from "../../assets/Uc_merced_logo.png"; // add this if not already

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "student", // default
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    let user = null;
    const storedUser = localStorage.getItem("user");
    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.warn("Error parsing user:", err);
    }

    if (user) {
      if (user.role === "student") navigate("/studentpage");
      else if (user.role === "teacher") navigate("/teacherpage");
      else if (user.role === "admin") window.location.href = "http://127.0.0.1:5000/admin";
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <img src={ucmLogo} alt="UC Merced Logo" className="register-logo" />
        <h1 className="register-title">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            className="dropdown"
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <Button1 type="submit" label="Register" />
        </form>
  
        {message && (
          <p
            className="register-message"
            style={{
              color: message.includes("passed") ? "#2e7d32" : "#d32f2f",
            }}
          >
            {message}
          </p>
        )}
  
        <div className="back-btn-wrapper">
          <button className="back-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
