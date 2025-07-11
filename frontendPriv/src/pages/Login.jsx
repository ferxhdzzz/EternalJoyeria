import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import OlvidarCont from "../components/registro/labelcont/LabelCont";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/Recuperacion.css";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Credenciales incorrectas",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido/a de vuelta!",
        text: "Has iniciado sesión exitosamente.",
      }).then(() => navigate("/dashboard"));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de conexión con el servidor.",
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
      <form className="recover-card" onSubmit={handleSubmit(onSubmit)}>
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesión</h2>

        <Input
          label="Correo"
          {...register("email", { required: "El correo es obligatorio." })}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        <div className="input-group-eye">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "La contraseña es obligatoria." })}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <OlvidarCont text="¿Olvidaste tu contraseña?" to="/recuperacion" />
        <Button type="submit" text="Ingresar →" />
      </form>
    </div>
  );
}
