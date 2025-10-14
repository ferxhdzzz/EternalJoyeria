// frontendPriv/src/components/reseñas/modal/ConfirmacionModal.jsx
import React from "react";
import "../../../styles/shared/buttons.css";
import "../../../styles/shared/modal.css";
import EJModal from "../../Ui/EJModal";

const ConfirmacionModal = ({ mensaje, onConfirmar, onCancelar }) => {
  return (
    <EJModal
      isOpen={true}
      onClose={onCancelar}
      title="Confirmar acción"
      footer={
        <>
          <button className="ej-btn ej-danger ej-size-sm" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="ej-btn ej-approve ej-size-sm" onClick={onConfirmar} data-autofocus>
            Eliminar
          </button>
        </>
      }
    >
      <p className="ej-modal__message">{mensaje}</p>
    </EJModal>
  );
};

export default TablaResenas;