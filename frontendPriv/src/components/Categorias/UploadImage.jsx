import React from 'react';
import './UploadImage.css';

const UploadImage = () => {
  return (
    <div className="upload-container">
      <div className="image-preview">
        <img
          src="/karinaaaaaa.jpg"
          alt="Vista previa"
          className="preview-img"
        />
      </div>
      <button className="upload-button">Subir imagen</button>
    </div>
  );
};

export default UploadImage;
