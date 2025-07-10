import React from "react";
import "./InputStyles.css";

const TextInput = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  error, 
  placeholder = "", 
  maxLength,
  icon
}) => {
  return (
    <div className="custom-input-wrapper">
      <label className="custom-input-label">{label}</label>
      <div className="custom-input-container">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`custom-input ${error ? "custom-input-error" : ""}`}
          autoComplete="off"
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {icon && <div className="custom-input-icon">{icon}</div>}
      </div>
      {error && <p className="custom-input-error-text">{error}</p>}
    </div>
  );
};

export default TextInput; 