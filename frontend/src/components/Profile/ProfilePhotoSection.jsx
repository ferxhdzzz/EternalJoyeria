import React from 'react';
import '../../styles/ProfilePhotoSection.css';

const ProfilePhotoSection = () => {
  return (
    <div className="profile-right">
      <img src="/Perfil/foto-perfil.png" alt="Foto de perfil" className="profile-photo" />

      <button className="secondary-btn btn-photo">Tomar foto</button>
      <button className="secondary-btn btn-upload">Subir imagen</button>
      <button className="secondary-btn btn-history">Historial de compras</button>
    </div>
  );
};

export default ProfilePhotoSection;