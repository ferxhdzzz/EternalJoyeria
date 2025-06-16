import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Select from "../components/registro/selector/Select";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/Registro.css";

const RegistroPaso2 = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    contra: "",
    country: "sv"
  });
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      navigate("/registro3");
    }
  };

  return (
    <div className="recover-wrappere" style={{ backgroundImage: `url("/registeeer.png")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="recover-card">
        <BackArrow to="/registro" />
        <Logo />
        <h2 className="recover-title">Registrarse 
        </h2>
        <h4>Paso 2</h4>

        <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email}</p>}

      

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

          <Select
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          country={form.country}
          onCountryChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <Button text="Registrarse →" onClick={handleSubmit} />
       
      </div>
    </div>
  );
};

export default RegistroPaso2;
