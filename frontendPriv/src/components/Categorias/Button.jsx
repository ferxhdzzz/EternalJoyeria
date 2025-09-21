import React from "react";
import "../../styles/shared/buttons.css"; // asegura estilos
import "./Button.css"; // si tienes estilos locales extra

const Button = ({ text, type = "button", variant = "approve", className = "", ...props }) => {
  // variantes: "approve" | "danger" | "primary"
  const variantClass =
    variant === "danger" ? "ej-danger"
    : variant === "primary" ? "ej-primary"
    : "ej-approve";

  return (
    <button
      type={type}
      className={`ej-btn ${variantClass} ${className}`.trim()}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
