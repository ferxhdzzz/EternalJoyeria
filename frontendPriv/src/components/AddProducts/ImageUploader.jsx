import React from 'react';
import '../../styles/AddProducts/ImageUploader.css';

const ImageUploader = () => {
  return (
    <div className="image-uploader">
      <img src="/Products/product5.png" alt="preview" />
      <button>Subir imagen</button>
    </div>
  );
};

export default ImageUploader;
