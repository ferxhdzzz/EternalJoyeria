import React from "react";
import "./Input.css";

const Input = ({ label, type = "text", value, onChange, name }) => {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default Input;
