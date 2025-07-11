import React from "react";
import "./TextArea.css";

const TextArea = React.forwardRef(({ label, placeholder, rows = 5, error, ...props }, ref) => {
  return (
    <div className="textarea-container">
      <label className="textarea-label">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        ref={ref}
        className="textarea-field"
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

export default TextArea;
