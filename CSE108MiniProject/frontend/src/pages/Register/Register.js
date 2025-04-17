import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button1 from "../../components/Button1/Button1";
import "./Register.css"; // Import your CSS file for styling

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
      else if (user.role === "admin") window.location.href = "http://localhost:5000/admin";
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-container2">
        <div className="register-container">
          <h1>Register Account</h1>
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
          {message && <p>{message}</p>}

          {/* Back Button to navigate to Home.js */}
          <button onClick={() => navigate("/")}>Back to Home</button> {/* Back to Home button */}
        </div>
      </div>
    </div>
  );
};

export default Register;
