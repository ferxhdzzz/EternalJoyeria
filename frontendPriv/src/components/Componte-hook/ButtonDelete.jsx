import React from "react";
import "../../styles/shared/buttons.css";

export default function ButtonDelete({ children = "Eliminar", className = "", ...props }) {
  return (
    <button
      type="button"
      className={`ej-btn ej-danger ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
