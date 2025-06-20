import React from "react";
import "./Input.css";

const Input = ({ label, type = "text", name, value, onChange, icon }) => {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <div className="input-container">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="input"
          autoComplete="off"
        />
        {icon}
      </div>
    </div>
  );
};

export default Input;
