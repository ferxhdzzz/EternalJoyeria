import React from "react";
import Button from "./Button";
import Label from "./Label";
import PasswordLabel from "./PasswordLabel";
import "./ProfileDetails.css";
import "../../styles/shared/buttons.css";

const ProfileDetails = () => {
  return (
    <div className="profile-details">
      <div className="profile-header">
        <img src="/profile.jpg" alt="Profile" className="profile-image" />
        <button type="button" className="ej-btn ej-approve">
          Actualizar foto
        </button>
      </div>
      <div className="info-section">
        <div className="info-row">
          <Label text="Tu nombre" />
          <p>Jennifer Teos</p>
          <button type="button" className="ej-btn ej-approve">
            Editar
          </button>
        </div>
        <div className="info-row">
          <Label text="Tu correo" />
          <p>t22jenn@gmail.com</p>
          <button type="button" className="ej-btn ej-approve">
            Editar
          </button>
        </div>
        <div className="info-row">
          <Label text="Tu teléfono" />
          <p>+503 7104-2228</p>
          <button type="button" className="ej-btn ej-approve">
            Editar
          </button>
        </div>
        <div className="info-row">
          <PasswordLabel label="Tu contraseña" password="12345Secure!" />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
