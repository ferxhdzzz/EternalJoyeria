import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import './ProfilePhotoUpload.css';
import { useNavigate } from 'react-router-dom';
import Button from '../registro/button/Button'; // Importar el componente Button

const ProfilePhotoUpload = ({ prevStep }) => {
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleFinish = () => {
    Swal.fire({
      title: '¡Bienvenida!',
      text: 'Tu cuenta ha sido creada exitosamente.',
      icon: 'success',
      confirmButtonText: '¡Genial!',
      confirmButtonColor: '#ff69b4',
    }).then(() => {
        navigate('/login');
    });
  };

  return (
    <div className="profile-photo-upload">
      <h2>Elige tu Foto de Perfil</h2>
      <p>¡Casi terminas! Sube una foto para que otros te reconozcan.</p>
      
      <div className="photo-container">
        <img src={profileImage} alt="Foto de perfil" className="profile-photo-preview" />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <div className="button-container">
        <Button text="Subir Imagen" onClick={handleUploadClick} />
      </div>

      <div className="button-container">
        <Button text="Finalizar" onClick={handleFinish} />
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
