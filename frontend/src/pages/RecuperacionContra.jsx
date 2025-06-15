import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import "./Recuperacion.css";

const RecoverPassword = () => {
const [form, setForm] = useState({ email: "", code: "" });
const [errors, setErrors] = useState({ email: "", code: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};


const handleSubmit = () => {
  const { email, code } = form;
  let newErrors = { email: "", code: "" };
  let hasError = false;

  if (!email) {
    newErrors.email = "El correo es obligatorio.";
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "El correo no es válido.";
    hasError = true;
  }

  if (!code) {
    newErrors.code = "El código es obligatorio.";
    hasError = true;
  }

  setErrors(newErrors);

  if (hasError) return;

  // Si pasa las validaciones, navegar o continuar
  navigate("/cambiar");
};

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/fondoEternal.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        <BackArrow to="/login" />
        <Logo />
       <Input
  label="Correo"
  name="email"
  value={form.email}
  onChange={handleChange}
/>
{errors.email && <p className="error-message">{errors.email}</p>}

<Input
  label="Código de confirmacion"
  name="code"
  value={form.code}
  onChange={handleChange}
/>
{errors.code && <p className="error-message">{errors.code}</p>}
        <Button text="enviar  →" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default RecoverPassword;
