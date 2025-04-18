import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ucmLogo from '../../assets/Uc_merced_logo.png'; // adjust path if needed

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <img src={ucmLogo} alt="UC Merced Logo" className="home-logo" />
        <h1 className="home-title">Welcome to the UC Merced Portal</h1>
        <p className="home-subtitle">Manage your courses, grades, and more.</p>
        <p className="home-motto">Fiat Lux — Let There Be Light</p>

        <div className="home-buttons">
          <Link to="/register" className="home-btn">Register</Link>
          <Link to="/login" className="home-btn">Login</Link>
          <Link to="/admin" className="home-btn">Admin Panel</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
