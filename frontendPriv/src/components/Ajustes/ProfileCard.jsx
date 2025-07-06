import React, { useState } from "react";
import Label from "./Label";
import Button from "./Button";
import "./ProfileCard.css";

const ProfileCard = () => {
  const [formData, setFormData] = useState({
    nombre: "Jennifer Teos",
    correo: "t22jenn@gmail.com",
    contraseña: "**********",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src="/karinaaaaaa.jpg" alt="Profile" className="profile-image" />
        <Button text="Actualizar todo" className="update-button" />
      </div>

      <div className="info-container">
        <div className="info-box">

          {/* Nombre */}
          <div className="info-row">
            <Label text="Nombre" />
            <div className="input-row">
              <input
                type="text"
                name="nombre"
                className="info-input"
                value={formData.nombre}
                onChange={handleChange}
              />
              <Button text="Editar" className="edit-button" onClick={() => {}} />
            </div>
          </div>

          {/* Correo */}
          <div className="info-row">
            <Label text="Correo" />
            <div className="input-row">
              <input
                type="text"
                name="correo"
                className="info-input"
                value={formData.correo}
                onChange={handleChange}
              />
              <Button text="Editar" className="edit-button" onClick={() => {}} />
            </div>
          </div>

          {/* Contraseña */}
          <div className="info-row">
            <Label text="Contraseña" />
            <div className="input-row">
              <input
                type="password"
                name="contraseña"
                className="info-input"
                value={formData.contraseña}
                onChange={handleChange}
              />
              <Button text="Editar" className="edit-button" onClick={() => {}} />
            </div>
          </div>

        </div>

        <div className="admin-box">
          <div className="info-row">
            <Label text="Acerca del administrador" />
            <p className="admin-description">
              El administrador es el usuario responsable de gestionar y supervisar el funcionamiento completo del sitio web de Eternal Joyería. Tiene acceso exclusivo a las funciones internas de la plataforma, permitiéndole agregar, editar o eliminar productos, gestionar pedidos, revisar comentarios de clientes y mantener actualizada la información de la tienda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
