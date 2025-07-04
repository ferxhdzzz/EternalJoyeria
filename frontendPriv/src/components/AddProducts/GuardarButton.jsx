import React from "react";

const GuardarButton = ({ onClick }) => {
  return (
    <button type="button" className="guardar-button" onClick={onClick}>
      Guardar
    </button>
  );
};

export default GuardarButton;
