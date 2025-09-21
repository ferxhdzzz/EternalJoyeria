import React from "react";
import "../../styles/shared/buttons.css";

const Button = ({ type = "button", children, variant = "approve", className = "", onClick }) => {
  const variantClass =
    variant === "danger" ? "ej-danger" :
    variant === "primary" ? "ej-primary" :
    "ej-approve";

  return (
    <button
      type={type}
      className={`ej-btn ${variantClass} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
