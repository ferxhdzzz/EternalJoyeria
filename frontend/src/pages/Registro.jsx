
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";
import OlvidarCont from "../components/registro/labelcont/LabelCont";

import "./Registro.css";

const Registro = () => {
  const [form, setForm] = useState({ email: "", code: "" });
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/products");
  };

  return (
    <div
      className="recover-wrappere"
      style={{
        backgroundImage: `url("/registeeer.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        <BackArrow to="/login" />
        <Logo />
        <h2 className="recover-title">Registrarse</h2>
        <Input label="Nombre" name="name" value="" onChange="" />
        
        <Input label="Apellido" name="lastName" value="" onChange="" />

        <Input label="Usuario" name="user" value="" onChange="" />

        <Input label="Correo" name="email" value="" onChange="" />

        <Input label="Teléfono" name="phonr" value="" onChange="" />

        <Input label="Contraseña" type="password" name="password" value="" onChange="" />


  
        <Button text="      Registrarse        →      " onClick={handleSubmit} />
        <Label
  textBefore="¿Yatienes cuenta?"
  linkText="     Inicia sesion       "
  to="/login"
/>
      </div>

      
    </div>
  );
};

export default Registro;
