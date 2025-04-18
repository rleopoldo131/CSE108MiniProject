import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      window.open("http://127.0.0.1:5000/admin/", "_blank");
      setError("");
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <h2 className="admin-title">Admin Portal Access</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
          />
          <button type="submit" className="admin-submit">Submit</button>
        </form>

        {error && <p className="admin-error">{error}</p>}
      </div>
    </div>
  );
};

export default Admin;
