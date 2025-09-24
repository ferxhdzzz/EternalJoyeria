// frontend/src/components/Reviews/ConfirmacionModalPublic.jsx
import React from "react";
import "../../styles/shared/buttons.css";
import "../../styles/shared/modal.css";
import EJModal from "../ui/EJModal";

export default function ConfirmacionModalPublic({
  mensaje = "¿Seguro que quieres continuar?",
  onConfirmar,
  onCancelar,
  isOpen = true,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  return (
    <EJModal
      isOpen={isOpen}
      onClose={onCancelar}
      title="Confirmar acción"
      footer={
        <>
          <button className="ej-btn ej-danger ej-size-sm" onClick={onCancelar}>
            {cancelText}
          </button>
          <button
            className="ej-btn ej-approve ej-size-sm"
            onClick={onConfirmar}
            data-autofocus
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="ej-modal__message">{mensaje}</p>
    </EJModal>
  );
}
