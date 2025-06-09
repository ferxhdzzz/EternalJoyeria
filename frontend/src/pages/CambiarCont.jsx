import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Recuperacion/Logo";
import Input from "../components/Recuperacion/InputGroup";
import Button from "../components/Recuperacion/Button";
import BackArrow from "../components/Recuperacion/BackArrow";
import "./Recuperacion.css";

const CambiarContra = () => {
  const [form, setForm] = useState({ email: "", code: "" });
  const navigate = useNavigate();




  const handleSubmit = () => {
    // Aquí podrías validar o conectar al backend
    navigate("/login"); // Cambia esta ruta según la necesidad
  };

  return (

    
    <div className="recover-wrapper">
      <div className="recover-card">

      <BackArrow to="/recuperacion" />
        <Logo />
        <h2 className="recover-title">Recuperar contraseña</h2>
        <Input
          label="Nueva Contraseña"
          name="Password"
          type="password"
          value=""
          onChange=""
        />
        <Input
          label="Confirmar contraseña"
           type="password"
          name="Password"
          value=""
          onChange=""
        />
        <Button text="Actualizar →" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CambiarContra;