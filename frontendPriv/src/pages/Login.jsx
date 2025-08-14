import React, { useState } from "react";
import { useForm } from "react-hook-form"; // Para manejo de formularios y validaciones
import { useNavigate } from "react-router-dom"; // Para navegación programática
import Swal from "sweetalert2"; // Para alertas bonitas

import Logo from "../components/registro/logo/Logo"; // Componente logo
import Input from "../components/registro/inpungroup/InputGroup"; // Componente input personalizado
import Button from "../components/registro/button/Button"; // Componente botón personalizado
import BackArrow from "../components/registro/backarrow/BackArrow"; // Botón flecha atrás
import OlvidarCont from "../components/registro/labelcont/LabelCont"; // Link "Olvidaste tu contraseña"

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Iconos para mostrar/ocultar contraseña
import "../styles/Recuperacion.css"; // Estilos específicos

export default function Login() {
  // Hook para manejo de formulario con react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();
  // Estado para mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Hook para navegación
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      // Llamada a API para login con método POST
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // para enviar cookies (sesión)
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      // Si la respuesta no es exitosa, mostrar error con SweetAlert
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Credenciales incorrectas",
        });
        return;
      }

      // Mostrar mensaje de éxito y redirigir al dashboard
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido/a de vuelta!",
        text: "Has iniciado sesión exitosamente.",
      }).then(() => navigate("/dashboard"));
    } catch (error) {
      console.error(error);
      // Si hay error en la conexión, mostrar alerta de error
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
        backgroundImage: `url("/LoginPriv.png")`, // Imagen de fondo
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Formulario con manejo de submit */}
      <form className="recover-card" onSubmit={handleSubmit(onSubmit)}>
        <BackArrow to="/" /> {/* Botón para volver a la página anterior */}
        <Logo /> {/* Logo */}
        <h2 className="recover-title">Iniciar sesión</h2>

        {/* Input para correo con validación */}
        <Input
          label="Correo"
          {...register("email", { required: "El correo es obligatorio." })}
        />
        {/* Mostrar mensaje de error si hay */}
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        {/* Campo contraseña con ícono para mostrar/ocultar */}
        <div className="input-group-eye">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"} // Mostrar u ocultar contraseña
            {...register("password", { required: "La contraseña es obligatoria." })}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)} // Alternar visibilidad
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {/* Mostrar mensaje de error si hay */}
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        {/* Link para recuperación de contraseña */}
        <OlvidarCont text="¿Olvidaste tu contraseña?" to="/recuperacion" />
        {/* Botón para enviar formulario */}
        <Button type="submit" text="Ingresar →" />
      </form>
    </div>
  );
}
