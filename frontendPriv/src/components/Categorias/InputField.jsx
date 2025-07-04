import React from 'react';
import './InputField.css';

const InputField = ({ label, placeholder, value, onChange, error }) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;
