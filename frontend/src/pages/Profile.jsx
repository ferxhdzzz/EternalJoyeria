import React, { useState } from 'react';
import '../styles/Profile.css';
import Nav from '../components/Nav/Nav';

const Profile = () => {
  const [name] = useState('Aeri');
  const [email] = useState('aeriuchinaga@gmail.com');

  return (
    <>
      <Nav />
      <div className="profile-page">
        <div className="profile-left">
          <h2 className="section-title">Detalles</h2>

          <label className="field-label">Nombre</label>
          <input className="input disabled narrow" type="text" value={name} disabled />

          <label className="field-label">Email</label>
          <input className="input disabled narrow" type="email" value={email} disabled />

          <button className="primary-btn">Guardar</button>

          <h2 className="section-title pwd-title">Contraseña</h2>
          <span className="subtitle">Cambiar la contraseña</span>

          <div className="pwd-inputs-container">
            <input className="input" type="password" placeholder="**********" />
            <input className="input" type="password" placeholder="Confirmar contraseña" />
          </div>

          <button className="primary-btn pwd-save-btn">Guardar</button>
        </div>

        <div className="profile-right">
          <img src="/Perfil/foto-perfil.png" alt="Foto de perfil" className="profile-photo" />

          <button className="secondary-btn btn-photo">Tomar foto</button>
          <button className="secondary-btn btn-upload">Subir imagen</button>
          <button className="secondary-btn btn-history">Historial de compras</button>
        </div>
      </div>
    </>
  );
};

export default Profile;
