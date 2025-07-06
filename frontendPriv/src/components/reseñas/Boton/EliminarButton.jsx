import React from "react";
import "./EliminarButton.css";

const EliminarButton = ({ onClick, text = "Eliminar" }) => {
  return (
    <button className="eliminar-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default EliminarButton;
