import React from 'react';
import './TextArea.css';

const TextArea = ({ label, placeholder, rows = 5, value, onChange, error }) => {
  return (
    <div className="textarea-container">
      <label className="textarea-label">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        className="textarea-field"
      ></textarea>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default TextArea;
