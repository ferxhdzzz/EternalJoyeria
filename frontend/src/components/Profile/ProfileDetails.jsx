import React, { useState } from 'react';
import '../../styles/ProfileDetails.css';

const ProfileDetails = () => {
  const [name, setName] = useState('Aeri');
  const [email, setEmail] = useState('aeriuchinaga@gmail.com');

  return (
    <div className="profile-left">
      <h2 className="section-title">Detalles</h2>

      <input
        className="input narrow"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
      />

      <input
        className="input narrow"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <button className="primary-btn">Guardar</button>

      <h2 className="section-title pwd-title">Contraseña</h2>
      <span className="subtitle">Cambiar la contraseña</span>

      <div className="pwd-inputs-container">
        <input className="input" type="password" placeholder="Nueva contraseña" />
        <input className="input" type="password" placeholder="Confirmar contraseña" />
      </div>

      <button className="primary-btn pwd-save-btn">Guardar</button>
    </div>
  );
};

export default ProfileDetails;
