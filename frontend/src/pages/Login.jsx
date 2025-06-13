import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";
import OlvidarCont from "../components/registro/labelcont/LabelCont";

import "./Recuperacion.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", code: "" });
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/products");
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/loginneternal.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesion</h2>
        <Input label="Correo" name="email" value="" onChange="" />
        
        <Input label="Contraseña" name="code" value="" onChange="" />

        <OlvidarCont
  text="¿Olvidaste tu contraseña?"
  to="/recuperacion"
/>
        <Button text="      Ingresar        →      " onClick={handleSubmit} />
        <Label
  textBefore="¿No tienes cuenta?"
  linkText="     Regístrate       "
  to="/registro"
/>
      </div>

      
    </div>
  );
};

export default Login;
