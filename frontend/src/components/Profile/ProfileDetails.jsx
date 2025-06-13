import React, { useState } from 'react';
import '../../styles/ProfileDetails.css';

const ProfileDetails = () => {
  const [name] = useState('Aeri');
  const [email] = useState('aeriuchinaga@gmail.com');

  return (
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
  );
};

export default ProfileDetails;