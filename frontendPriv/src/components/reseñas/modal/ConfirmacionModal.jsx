import React from "react";
import "./ConfirmacionModal.css";

const ConfirmacionModal = ({ mensaje, onConfirmar, onCancelar }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <p>{mensaje}</p>
        <div className="modal-botones">
          <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
          <button className="btn-confirmar" onClick={onConfirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal;
