import React, { useRef } from 'react';
import UploadButton from './UploadButton';
import '../../styles/AddProducts/ImageUploader.css';

const ImageUploader = () => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = () => {
  };

  return (
    <div className="image-uploader">
      <img src="/Products/product5.png" alt="preview" />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <UploadButton onClick={handleButtonClick} />
    </div>
  );
};

export default ImageUploader;
