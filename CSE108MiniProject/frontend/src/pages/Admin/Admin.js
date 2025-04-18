import React, { useState } from "react";

const Admin = () => {
  const [password, setPassword] = useState("");//password for admin access
  const [error, setError] = useState("");//error display for errors

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") { //havign admin passcode
      window.open("http://localhost:5000/admin/", "_blank");//opening localhost for admin web app 
      setError("");
    } else {
      setError("Incorrect password.");//if wrong diplay error
    }
  };

  return (
    <div className="page-container2" style={{ textAlign: "center" }}>
      <h2>Admin Access</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "8px 16px" }}>
          Submit
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Admin;