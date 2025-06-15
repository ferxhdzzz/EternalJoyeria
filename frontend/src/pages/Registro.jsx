import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import "./Registro.css";

const Registro = () => {
  const [form, setForm] = useState({ email: "", contra: "", name: "", lastName: "", user: "", phone: "", country: "sv" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const phoneRegex = /^\d+$/;

    // Validaciones
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    else if (!nameRegex.test(form.name)) newErrors.name = "El nombre solo debe contener letras.";

    if (!form.lastName.trim()) newErrors.lastName = "El apellido es obligatorio.";
    else if (!nameRegex.test(form.lastName)) newErrors.lastName = "El apellido solo debe contener letras.";

    if (!form.user.trim()) newErrors.user = "El usuario es obligatorio.";

    if (!form.email.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(form.email)) newErrors.email = "Correo no válido.";

    if (!form.phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    else if (!phoneRegex.test(form.phone)) newErrors.phone = "El teléfono solo debe contener números.";
    else {
      if (form.country === "sv" && form.phone.length !== 8) {
        newErrors.phone = "El teléfono debe tener 8 dígitos para El Salvador.";
      } else if (form.country === "us" && form.phone.length !== 10) {
        newErrors.phone = "El teléfono debe tener 10 dígitos para Estados Unidos.";
      }
    }

    if (!form.contra.trim()) newErrors.contra = "La contraseña es obligatoria.";
    else if (!passwordRegex.test(form.contra)) {
      newErrors.contra = "Debe tener al menos 8 caracteres y un carácter especial.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigate("/products");
    }
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

        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}

        <Input label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <Input label="Usuario" name="user" value={form.user} onChange={handleChange} />
        {errors.user && <p className="error">{errors.user}</p>}

        <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email}</p>}

        <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* Puedes agregar aquí un selector de país */}
        {/* <select name="country" onChange={handleChange}>
          <option value="sv">El Salvador</option>
          <option value="us">Estados Unidos</option>
        </select> */}

        <div className="input-group-eye">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="contra"
            value={form.contra}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.contra && <p className="error">{errors.contra}</p>}

        <Button text="Registrarse →" onClick={handleSubmit} />
        <Label textBefore="¿Ya tienes cuenta?" linkText="Inicia sesión" to="/login" />
      </div>
    </div>
  );
};

export default Registro;
