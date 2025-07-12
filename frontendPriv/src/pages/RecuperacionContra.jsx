// src/pages/RecuperacionContra.jsx
import React from "react";
import { useForm } from "react-hook-form"; // Manejo y validación de formularios
import { useNavigate } from "react-router-dom"; // Navegación programática
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword"; // Hook para lógica de recuperación de contraseña
import Logo from "../components/registro/logo/Logo"; // Logo reutilizable
import Input from "../components/registro/inpungroup/InputGroup"; // Input personalizado con label
import Button from "../components/registro/button/Button"; // Botón reutilizable
import BackArrow from "../components/registro/backarrow/BackArrow"; // Flecha para regresar atrás
import Swal from "sweetalert2"; // Librería para alertas
import "../styles/Recuperacion.css"; // Estilos CSS

const RecuperacionContra = () => {
  // Hook para formulario con validación
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Hook personalizado para pedir código de recuperación y estado de carga
  const { requestCode, loading } = useRecoverAdminPassword();

  // Hook para navegar a otras rutas
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    try {
      // Llamada al hook para pedir el código al backend
      const res = await requestCode(data.email);

      // Si el mensaje indica éxito, mostrar alerta y navegar a página de verificación
      if (res.message?.includes("correctamente")) {
        Swal.fire("Éxito", res.message, "success");
        navigate("/verificar-codigo");
      } else {
        // Si no, mostrar error con mensaje del backend o genérico
        Swal.fire("Error", res.message || "No se pudo enviar el código.", "error");
      }
    } catch (error) {
      console.error(error); // Log del error (podrías mostrar otra alerta aquí si quieres)
    }
  };

  return (
    <div className="recover-wrapper"
      style={{
        backgroundImage: `url("/recuperacionPriv.png")`, // Imagen de fondo
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        {/* Botón para volver a login */}
        <BackArrow to="/login" />
        {/* Logo */}
        <Logo />

        {/* Título de la página */}
        <h2 className="recover-title">Recuperar Contraseña</h2>

        {/* Formulario que maneja la petición para enviar código */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Correo"
            {...register("email", {
              required: "El correo es obligatorio", // Validación requerida
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación formato email
                message: "Formato de correo inválido",
              },
            })}
          />
          {/* Mostrar mensaje de error si el email no pasa la validación */}
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          {/* Botón que cambia su texto cuando está cargando */}
          <Button text={loading ? "Enviando..." : "Enviar código →"} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default RecuperacionContra;
