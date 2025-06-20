import React, { useState, useRef } from 'react';
import '../../styles/ProfilePhotoSection.css';
import { useNavigate } from 'react-router-dom';


const ProfilePhotoSection = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  const fileInputRef = useRef(null);

  const handleBuy = () => {
    navigate('/historial');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-right">
      <img src={profileImage} alt="Foto de perfil" className="profile-photo" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <button className="secondary-btn btn-photo">Tomar foto</button>
      <button className="secondary-btn btn-upload" onClick={handleUploadClick}>
        Subir imagen
      </button>
      <button className="secondary-btn btn-history" onClick={handleBuy}>
        Historial de compras
      </button>
    </div>
  );
};

export default ProfilePhotoSection;