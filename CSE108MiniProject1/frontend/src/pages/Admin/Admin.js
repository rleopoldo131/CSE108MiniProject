import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [password, setPassword] = useState("");//password for admin access
  const [error, setError] = useState("");//error display for errors

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {//havign admin passcode
      window.open("http://127.0.0.1:5000/admin/", "_blank");//opening localhost for admin web app 
      setError("");
    } else {
      setError("Incorrect password.");//if wrong diplay error
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
