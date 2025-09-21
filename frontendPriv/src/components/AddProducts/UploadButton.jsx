import React from "react";
import "../../styles/shared/buttons.css";

const UploadButton = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className="ej-btn ej-approve">
      Subir imagen
    </button>
  );
};

export default UploadButton;
