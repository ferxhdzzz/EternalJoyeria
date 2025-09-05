// src/components/registro/inpungroup/InputGroup.jsx (o donde esté)
import React, { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(function Input(
  { label, id, icon, className = "", ...rest },
  ref
) {
  // Genera un id si no te pasan uno
  const inputId =
    id || `inp-${(label || "field").toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="input-container">
        {/* CLAVE: ref y ...rest vienen de react-hook-form o de tus props controladas */}
        <input
          id={inputId}
          ref={ref}
          autoComplete="off"
          className="input"
          {...rest}
        />
        {icon && React.cloneElement(icon, {
          style: {
            ...icon.props.style,
            right: '-12px !important',
            position: 'absolute !important'
          }
        })}
      </div>
    </div>
  );
});

export default Input;
