import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Button1 from "../../components/Button1/Button1";
import ucmLogo from "../../assets/Uc_merced_logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.role === "student") navigate("/studentpage");
        else if (user?.role === "teacher") navigate("/teacherpage");
        else if (user?.role === "admin") window.location.href = "http://127.0.0.1:5000/admin";
      } catch (e) {
        console.warn("Invalid JSON in localStorage for 'user'");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const { role } = res.data.user;
      if (role === "student") navigate("/studentpage");
      else if (role === "teacher") navigate("/teacherpage");
      else if (role === "admin") navigate("/adminpage");
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={ucmLogo} alt="UC Merced Logo" className="login-logo" />
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log in to your UC Merced Portal</p>

        <form onSubmit={handleSubmit} className="login-form">
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
          <Button1 type="submit" label="Login" />
        </form>

        {message && <p className="login-message">{message}</p>}

        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
