// src/components/Button1.js
import React from "react";
import "./Button1.css";

const Button1 = ({ label, onClick, type = "button", className = "" }) => {
  return (
    <button type={type} className={`button1 ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button1;
