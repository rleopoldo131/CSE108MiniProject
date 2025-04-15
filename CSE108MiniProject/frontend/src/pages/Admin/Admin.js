import React, { useState } from "react";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      window.open("http://localhost:5000/admin/", "_blank");
      setError("");
    } else {
      setError("Incorrect password.");
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