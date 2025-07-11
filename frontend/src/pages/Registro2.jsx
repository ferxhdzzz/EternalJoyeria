import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Select from "../components/registro/selector/Select";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/AuthStyles.css";

const Registro2 = ({ nextStep, prevStep }) => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    contra: "",
    country: "sv"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;

  // Si es el campo de teléfono, limita la longitud
  if (name === "phone") {
    const maxLength = form.country === "sv" ? 8 : 10;
    if (value.length > maxLength) return;
    // Solo números
    if (!/^\d*$/.test(value)) return;
  }

  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const phoneRegex = /^\d+$/;

    const newErrors = {};

    if (!form.email.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(form.email)) newErrors.email = "Correo no válido.";

    if (!form.phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    else if (!phoneRegex.test(form.phone)) newErrors.phone = "Solo números.";
    else {
      if (form.country === "sv" && form.phone.length !== 8)
        newErrors.phone = "Debe tener 8 dígitos para El Salvador.";
      else if (form.country === "us" && form.phone.length !== 10)
        newErrors.phone = "Debe tener 10 dígitos para EE.UU.";
    }

    if (!form.contra.trim()) newErrors.contra = "La contraseña es obligatoria.";
    else if (!passwordRegex.test(form.contra)) {
      newErrors.contra = "Debe tener al menos 8 caracteres y un carácter especial.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = () => {
    if (validateStep2()) {
      nextStep();
    }
  };

  return (
    <>
      <h2 className="recover-title">Detalles de la Cuenta</h2>
      <p>Asegura tu cuenta y elige cómo podemos contactarte.</p>

      <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
      {errors.email && <p className="error error-visible">{errors.email}</p>}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="contra"
        value={form.contra}
        onChange={handleChange}
        icon={
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        }
      />
      {errors.contra && <p className="error error-visible">{errors.contra}</p>}

      <Select
        label="Teléfono"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        country={form.country}
        onCountryChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
      />
      {errors.phone && <p className="error error-visible">{errors.phone}</p>}

      <div className="navigation-buttons">
        <Button text="← Atrás" onClick={prevStep} />
        <Button text="Siguiente →" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default Registro2;
