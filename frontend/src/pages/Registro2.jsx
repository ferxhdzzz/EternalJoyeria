// Registro2.js (Paso 2)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/AuthStyles.css";

const Registro2 = ({ nextStep, prevStep, formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si es el campo de teléfono, limita la longitud a 8 dígitos
    if (name === "phone") {
      if (value.length > 8) return;
      // Solo números
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const phoneRegex = /^\d+$/;

    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Correo no válido.";

    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Solo números.";
    else if (formData.phone.length !== 8) newErrors.phone = "Debe tener 8 dígitos.";

    if (!formData.password.trim()) newErrors.password = "La contraseña es obligatoria.";
    else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Debe tener al menos 8 caracteres y un carácter especial.";
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

      <Input label="Correo" name="email" value={formData.email} onChange={handleChange} />
      {errors.email && <p className="error error-visible">{errors.email}</p>}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        icon={
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        }
      />
      {errors.password && <p className="error error-visible">{errors.password}</p>}

      <Input
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="12345678"
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