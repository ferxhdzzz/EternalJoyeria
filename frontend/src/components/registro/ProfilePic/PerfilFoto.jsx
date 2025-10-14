import React, { useRef } from "react";
import "./PerfilFoto.css";

const PerfilFoto = ({ src, alt = "Foto de perfil", size = 120, onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div className="perfil-foto-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img
        className="perfil-foto"
        src={src}
        alt={alt}
        style={{ width: size, height: size }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PerfilFoto;
