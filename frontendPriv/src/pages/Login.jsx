import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import OlvidarCont from "../components/registro/labelcont/LabelCont";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import "../styles/Recuperacion.css";

const LoginAdmin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;
    let newErrors = { email: "", password: "" };
    let hasError = false;

    // Validar correo
    if (!email) {
      newErrors.email = "El correo es obligatorio.";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato del correo no es válido.";
      hasError = true;
    }

    // Validar contraseña
    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
      hasError = true;
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // Hacer la petición al backend
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Muy importante para la cookie
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: result.message || "Credenciales incorrectas",
          icon: "error",
          confirmButtonColor: "#ff69b4",
        });
        return;
      }

      Swal.fire({
        title: "¡Bienvenido/a!",
        text: `Has iniciado sesión correctamente.`,
        icon: "success",
        confirmButtonColor: "#ff69b4",
      }).then(() => {
        navigate("/Dashboard");
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Error de conexión con el servidor",
        icon: "error",
        confirmButtonColor: "#ff69b4",
      });
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/LoginPriv.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form className="recover-card login-form" onSubmit={handleSubmit} noValidate>
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesión Admin</h2>

        <Input
          label="Correo"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <div className="input-group-eye">
          <Input
            label="Contraseña"
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

        <OlvidarCont
          text="¿Olvidaste tu contraseña?"
          to="/recuperacion"
        />

        <Button text="Ingresar →" type="submit" />
      </form>
    </div>
  );
};

export default LoginAdmin;
