import React from 'react';
import './InputField.css';

const InputField = ({ label, placeholder }) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default InputField;
