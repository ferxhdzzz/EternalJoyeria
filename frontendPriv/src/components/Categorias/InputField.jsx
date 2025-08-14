import React from "react";
import "./InputField.css";

const InputField = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input ref={ref} className="input-fieldd" {...props} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

export default InputField;
