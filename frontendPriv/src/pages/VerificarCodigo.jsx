import React from "react";
import { useForm } from "react-hook-form"; // Para manejo y validación del formulario
import { useNavigate } from "react-router-dom"; // Para navegación programática
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword"; // Hook para lógica de recuperación
import Swal from "sweetalert2"; // Para alertas bonitas
import Logo from "../components/registro/logo/Logo"; // Componente logo reutilizable
import Input from "../components/registro/inpungroup/InputGroup"; // Componente input con label
import Button from "../components/registro/button/Button"; // Botón reutilizable
import BackArrow from "../components/registro/backarrow/BackArrow"; // Flecha para regresar atrás
import "../styles/VerificarCodigo.css"; // Estilos específicos para esta página

export default function VerificarCodigo() {
  // Hook de react-hook-form para registro, manejo de submit y errores
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Hook personalizado para verificar el código y estado de carga
  const { verifyCode, loading } = useRecoverAdminPassword();

  // Hook para navegación a otras rutas
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    // Llama al hook verifyCode con el código ingresado
    const res = await verifyCode(data.code);

    // Si el mensaje de respuesta incluye "verificado", mostrar éxito y navegar a cambiar contraseña
    if (res.message?.includes("verificado")) {
      Swal.fire("Código correcto", res.message, "success");
      navigate("/cambiar");
    } else {
      // Si no, mostrar error con mensaje recibido o genérico
      Swal.fire("Error", res.message || "Código inválido.", "error");
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        {/* Botón para volver a la página anterior */}
        <BackArrow to="/recuperacion" />
        {/* Logo */}
        <Logo />

        {/* Título principal */}
        <h2 className="verify-title">Verificar Código</h2>

        {/* Formulario para ingresar el código de confirmación */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Código de confirmación"
            {...register("code", {
              required: "El código es obligatorio", // Validación: campo requerido
            })}
          />
          {/* Mostrar mensaje de error si el campo código no cumple validación */}
          {errors.code && <p className="verify-error">{errors.code.message}</p>}

          {/* Botón que muestra estado de carga o texto normal */}
          <Button text={loading ? "Verificando..." : "Verificar →"} type="submit" />
        </form>
      </div>
    </div>
  );
}
