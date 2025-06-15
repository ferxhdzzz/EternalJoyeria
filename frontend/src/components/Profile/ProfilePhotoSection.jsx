import React from 'react';
import '../../styles/ProfilePhotoSection.css';
import { useNavigate } from 'react-router-dom';


const ProfilePhotoSection = () => {

  const navigate = useNavigate();

const handleBuy = () => {
  navigate('/historial'); // ← Aquí va la ruta a la que quieres ir
}; 
  return (


    <div className="profile-right">
      <img src="/Perfil/foto-perfil.png" alt="Foto de perfil" className="profile-photo" />

      <button className="secondary-btn btn-photo">Tomar foto</button>
      <button className="secondary-btn btn-upload">Subir imagen</button>
      <button className="secondary-btn btn-history" onClick={handleBuy}>Historial de compras</button>
    </div>
  );
};

export default ProfilePhotoSection;