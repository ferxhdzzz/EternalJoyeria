import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Recuperacion/Logo";
import Input from "../components/Recuperacion/InputGroup";
import Button from "../components/Recuperacion/Button";
import BackArrow from "../components/Recuperacion/BackArrow";
import "./Recuperacion.css";

const RecoverPassword = () => {
  const [form, setForm] = useState({ email: "", code: "" });
  const navigate = useNavigate();




  const handleSubmit = () => {
    // Aquí podrías validar o conectar al backend
    navigate("/cambiar"); // Cambia esta ruta según la necesidad
  };

  return (

    
    <div className="recover-wrapper">
      <div className="recover-card">

      <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Recuperar contraseña</h2>
        <Input
          label="Correo"
          name="email"
          value=""
          onChange=""
        />
        <Input
          label="Código de confirmacion"
          name="code"
          value=""
          onChange=""
        />
        <Button text="ENVIAR →" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default RecoverPassword;
