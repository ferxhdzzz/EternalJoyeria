import React, { useState, useEffect } from "react";
import "./InputStyles.css";

const TextareaInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder = "", 
  maxLength = 255
}) => {
  const [charCount, setCharCount] = useState(0);
  const [localError, setLocalError] = useState("");
  
  useEffect(() => {
    setCharCount(value?.length || 0);
    
    // Validar longitud mínima
    if (value && value.trim().length > 0 && value.trim().length < 10) {
      setLocalError("La descripción debe tener al menos 10 caracteres.");
    } else {
      setLocalError("");
    }
  }, [value]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(e);
      setCharCount(newValue.length);
    }
  };
  
  return (
    <div className="custom-input-wrapper">
      <label className="custom-input-label">{label}</label>
      <div className="custom-input-container">
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          className={`custom-textarea ${(error || localError) ? "custom-input-error" : ""}`}
          autoComplete="off"
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
        />
      </div>
      <div className="char-counter">
        <span>{maxLength - charCount} caracteres restantes</span>
      </div>
      {(error || localError) && <p className="custom-input-error-text">{error || localError}</p>}
    </div>
  );
};

export default TextareaInput; 