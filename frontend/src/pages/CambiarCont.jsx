import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./Recuperacion.css";

const CambiarContra = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handleSubmit = () => {
    const { password, confirmPassword } = form;
    let newErrors = { password: "", confirmPassword: "" };
    let hasError = false;

    // Campo vacío
    if (!password) {
      newErrors.password = "Complete todos los campos.";
      hasError = true;
    } else {
      // Longitud mínima
      if (password.length < 8) {
        newErrors.password = "Debe tener al menos 8 caracteres.";
        hasError = true;
      }

      // Al menos un carácter especial
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = "Debe incluir al menos un carácter especial.";
        hasError = true;
      }
    }

    // Confirmación
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
      hasError = true;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // Si todo es válido, continúa
    navigate("/login");
  };

  return (


    <div className="recover-wrapper"
      style={{
        backgroundImage: `url("/fondoact.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>

      <div className="recover-card">

        <BackArrow to="/recuperacion" />
        <Logo />
        <h2 className="recover-title">Recuperar contraseña</h2>
        <div className="input-group-eye">
          <Input
            label="Nueva Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}

        <div className="input-group-eye">
          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
        <Button text="Actualizar →" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CambiarContra;