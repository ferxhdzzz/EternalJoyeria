import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";
import OlvidarCont from "../components/registro/labelcont/LabelCont";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import "../styles/AuthStyles.css";

import useLogin from "../hooks/auth/useLogin";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useLogin();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "El formato del correo no es válido.";
    if (!form.password) newErrors.password = "La contraseña es obligatoria.";
    else if (form.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      let mensaje = "";
      if (newErrors.email) mensaje += `${newErrors.email} <br>`;
      if (newErrors.password) mensaje += `${newErrors.password}`;
      Swal.fire({
        title: "Datos inválidos",
        html: mensaje,
        icon: "error",
        confirmButtonColor: "#b94a6c",
        background: "#fff",
        customClass: { title: "swal2-title-custom", popup: "swal2-popup-custom" },
      });
      return;
    }

    try {
      const res = await login({ email: form.email, password: form.password });
      if (res?.success) {
        Swal.fire({
          title: "¡Bienvenido/a de vuelta!",
          text: "Has iniciado sesión exitosamente.",
          icon: "success",
          confirmButtonText: "¡Genial!",
          confirmButtonColor: "#ff69b4",
        }).then(() => {
          navigate("/productos"); // ajusta si tu flujo requiere otra ruta
        });
      } else {
        Swal.fire({
          title: "No se pudo iniciar sesión",
          text: res?.message || "Credenciales inválidas.",
          icon: "error",
          confirmButtonColor: "#b94a6c",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo iniciar sesión.",
        icon: "error",
        confirmButtonColor: "#b94a6c",
      });
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/Registro/loginneternal.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form className="recover-card login-form" onSubmit={handleSubmit} noValidate>
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesión</h2>

        <Input label="Correo" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="input-group-eye">
          <Input
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <OlvidarCont text="¿Olvidaste tu contraseña?" to="/recuperacion" />
        <div className="auth-container login-specific-styles">
          <Button type="submit" text={loading ? "Ingresando..." : "Ingresar →"} />
        </div>
        <Label textBefore="¿No tienes cuenta?" linkText="Regístrate" to="/registro" />
      </form>
    </div>
  );
};

export default Login;