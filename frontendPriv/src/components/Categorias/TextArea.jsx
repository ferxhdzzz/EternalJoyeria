import React from 'react';
import './TextArea.css';

const TextArea = ({ label, placeholder, rows = 5 }) => {
  return (
    <div className="textarea-container">
      <label className="textarea-label">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="textarea-field"
      ></textarea>
    </div>
  );
};

export default TextArea;
