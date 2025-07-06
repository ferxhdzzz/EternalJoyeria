import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/AddProducts/ImageUploader.css';

const ImageUploader = () => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
    setCurrentIndex(0); // reset al primer slide
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="image-uploader">
      <div className="preview-container">
        {images.length > 0 && (
          <>
            <button className="arrow left" onClick={goPrev}>
              <FaChevronLeft />
            </button>

            <img
              src={images[currentIndex]}
              alt="preview"
              className="preview-img"
            />

            <button className="arrow right" onClick={goNext}>
              <FaChevronRight />
            </button>
          </>
        )}

        {images.length === 0 && (
          <img src="/Products/product5.png" alt="preview" className="preview-img" />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button className="upload-btn" onClick={handleButtonClick}>
        Subir imagen
      </button>
    </div>
  );
};

export default ImageUploader;
