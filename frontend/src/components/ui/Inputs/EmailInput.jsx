import React, { useState, useEffect } from "react";
import "./InputStyles.css";
import { MdEmail } from "react-icons/md";

const EmailInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder = "correo@ejemplo.com" 
}) => {
  const [localError, setLocalError] = useState("");
  
  useEffect(() => {
    // Validar correo solo cuando hay contenido
    if (value) {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        setLocalError("El formato del correo no es válido");
      } else {
        setLocalError("");
      }
    } else {
      setLocalError("");
    }
  }, [value]);
  
  return (
    <div className="custom-input-wrapper">
      <label className="custom-input-label">{label}</label>
      <div className="custom-input-container">
        <input
          type="email"
          name={name}
          value={value}
          onChange={onChange}
          className={`custom-input ${(error || localError) ? "custom-input-error" : ""}`}
          autoComplete="off"
          placeholder={placeholder}
        />
        <span className="custom-input-icon">
          <MdEmail size={18} />
        </span>
      </div>
      {(error || localError) && <p className="custom-input-error-text">{error || localError}</p>}
    </div>
  );
};

export default EmailInput; 