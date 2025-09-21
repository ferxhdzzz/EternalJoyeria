import React from "react";
import "../../styles/shared/buttons.css";

const GuardarButton = ({ onClick }) => {
  return (
    <button type="button" className="ej-btn ej-approve" onClick={onClick}>
      Guardar
    </button>
  );
};

export default GuardarButton;
