import React from 'react';

const UploadButton = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      Subir imagen
    </button>
  );
};

export default UploadButton;
