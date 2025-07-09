import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword";
import "../styles/Recuperacion.css";

const CambiarContra = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { newPassword } = useRecoverAdminPassword();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { password, confirmPassword } = form;
    let newErrors = { password: "", confirmPassword: "" };
    let hasError = false;

    if (!password) {
      newErrors.password = "Complete todos los campos.";
      hasError = true;
    } else {
      if (password.length < 8) {
        newErrors.password = "Debe tener al menos 8 caracteres.";
        hasError = true;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = "Debe incluir al menos un carácter especial.";
        hasError = true;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
      hasError = true;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const result = await newPassword(password);
      Swal.fire("Éxito", result.message, "success").then(() =>
        navigate("/login")
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la contraseña", "error");
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/recuperacionPriv.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
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
