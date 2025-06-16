import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";

import "../styles/Registro.css";

const RegistroPaso1 = () => {
  const [form, setForm] = useState({ name: "", lastName: "", user: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    else if (!nameRegex.test(form.name)) newErrors.name = "Solo letras.";

    if (!form.lastName.trim()) newErrors.lastName = "El apellido es obligatorio.";
    else if (!nameRegex.test(form.lastName)) newErrors.lastName = "Solo letras.";

    if (!form.user.trim()) newErrors.user = "El usuario es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      navigate("/registro2");
    }
  };

  return (
    <div className="recover-wrappere" style={{ backgroundImage: `url("/registeeer.png")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="recover-card">
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Registrarse</h2>
                <h4>Paso 1</h4>


        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}

        <Input label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <Input label="Usuario" name="user" value={form.user} onChange={handleChange} />
        {errors.user && <p className="error">{errors.user}</p>}

        <Button text="Siguiente →" onClick={handleNext} />
        <br />

         <Label textBefore="¿Ya tienes cuenta?" linkText="Inicia sesión" to="/login" />
      </div>
    </div>
  );
};

export default RegistroPaso1;
