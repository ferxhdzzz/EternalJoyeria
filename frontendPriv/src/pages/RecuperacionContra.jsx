// src/pages/RecuperacionContra.jsx
import React from "react";
import { useForm } from "react-hook-form"; // Manejo y validación de formularios
import { useNavigate } from "react-router-dom"; // Navegación programática
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword"; // Hook para lógica de recuperación de contraseña
import Logo from "../components/registro/logo/Logo"; // Logo reutilizable
import Button from "../components/registro/button/Button"; // Botón reutilizable
import BackArrow from "../components/registro/backarrow/BackArrow"; // Flecha para regresar atrás
import Swal from "sweetalert2"; // Librería para alertas
import "../styles/Recuperacion.css"; // Estilos CSS

// Componente Input mejorado con tema rosado
const PinkImprovedInput = React.forwardRef(({ 
  label, 
  type = "text", 
  error, 
  ...props 
}, ref) => {
  return (
    <div className="pink-input-container">
      <div className="pink-input-wrapper">
        <input
          ref={ref}
          type={type}
          className={`pink-input ${error ? 'error' : ''}`}
          placeholder=" "
          {...props}
        />
        <label className="pink-label">{label}</label>
      </div>
      {error && <span className="pink-error-message">{error}</span>}
    </div>
  );
});

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
      <div className="recover-card improved-form">
        {/* Botón para volver a login */}
        <BackArrow to="/login" />
        {/* Logo */}
        <Logo />

        {/* Título de la página */}
        <h2 className="recover-title">Recuperar Contraseña</h2>

        {/* Formulario que maneja la petición para enviar código */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pink-form-fields">
            <PinkImprovedInput
              label="Correo electrónico"
              type="email"
              error={errors.email?.message}
              {...register("email", {
                required: "El correo es obligatorio", // Validación requerida
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación formato email
                  message: "Formato de correo inválido",
                },
              })}
            />
          </div>

          {/* Botón que cambia su texto cuando está cargando */}
          <Button text={loading ? "Enviando..." : "Enviar código →"} type="submit" />
        </form>
      </div>

      <style jsx>{`
        /* Estilos para los inputs rosados mejorados */
        .pink-input-container {
          margin-bottom: 20px;
          width: 100%;
        }

        .pink-input-wrapper {
          position: relative;
          width: 100%;
        }

        .pink-input {
          width: 100%;
          height: 56px;
          padding: 16px 16px 8px 16px;
          border: 2px solid #f8bbd9;
          border-radius: 16px;
          font-size: 16px;
          font-family: inherit;
          background: linear-gradient(145deg, #fef7f7, #fff0f3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          box-sizing: border-box;
          color: #4a4a4a;
        }

        .pink-input:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15), 
                      0 4px 12px rgba(236, 72, 153, 0.1);
          background: linear-gradient(145deg, #ffffff, #fef7f7);
          transform: translateY(-1px) scale(1.01);
        }

        .pink-input:hover:not(:focus) {
          border-color: #f472b6;
          box-shadow: 0 2px 8px rgba(244, 114, 182, 0.12);
          transform: translateY(-0.5px);
        }

        .pink-input.error {
          border-color: #f87171;
          background: linear-gradient(145deg, #fef2f2, #fff5f5);
          animation: shake 0.5s ease-in-out;
        }

        .pink-input.error:focus {
          box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.15);
          border-color: #ef4444;
        }

        .pink-input::placeholder {
          color: #d1a3a3;
        }

        .pink-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #be185d;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(145deg, #fef7f7, #fff0f3);
          padding: 0 6px;
          border-radius: 6px;
          font-weight: 500;
        }

        .pink-input:focus + .pink-label,
        .pink-input:not(:placeholder-shown) + .pink-label {
          top: -2px;
          font-size: 12px;
          font-weight: 600;
          color: #ec4899;
          transform: translateY(0) scale(0.95);
          background: linear-gradient(145deg, #ffffff, #fef7f7);
          box-shadow: 0 2px 4px rgba(236, 72, 153, 0.1);
        }

        .pink-input.error:focus + .pink-label,
        .pink-input.error:not(:placeholder-shown) + .pink-label {
          color: #ef4444;
          background: linear-gradient(145deg, #fef2f2, #fff5f5);
        }

        .pink-error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 14px;
          margin-top: 6px;
          margin-left: 4px;
          font-weight: 500;
          animation: slideInDown 0.3s ease-out;
        }

        .pink-error-message::before {
          content: "";
          font-size: 12px;
        }

        .pink-form-fields {
          width: 100%;
          margin: 24px 0;
        }

        .improved-form {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(248, 187, 217, 0.3);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 10px 10px -5px rgba(0, 0, 0, 0.04),
                      0 0 0 1px rgba(236, 72, 153, 0.05);
          border-radius: 20px;
        }

        .recover-title {
          color: #be185d;
          background: linear-gradient(135deg, #be185d, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-align: center;
          margin: 16px 0 24px 0;
          font-size: 1.75rem;
        }

        /* Animaciones */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pinkGlow {
          0% { box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15); }
          50% { box-shadow: 0 0 0 6px rgba(236, 72, 153, 0.1); }
          100% { box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15); }
        }

        .pink-input:focus {
          animation: pinkGlow 2s ease-in-out infinite;
        }

        /* Mejoras responsive para móvil */
        @media (max-width: 768px) {
          .recover-card.improved-form {
            margin: 20px;
            padding: 24px 20px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.97);
          }

          .recover-title {
            font-size: 1.5rem;
            margin: 16px 0 24px 0;
          }

          .pink-input {
            height: 54px;
            font-size: 16px;
            border-radius: 14px;
          }

          .pink-input:focus {
            transform: translateY(-0.5px) scale(1.005);
          }

          .pink-form-fields {
            margin: 20px 0;
          }

          .pink-input-container {
            margin-bottom: 18px;
          }
        }

        /* Para dispositivos muy pequeños */
        @media (max-width: 480px) {
          .recover-wrapper {
            padding: 10px;
          }

          .recover-card.improved-form {
            margin: 10px;
            padding: 20px 16px;
            border-radius: 16px;
          }

          .pink-input {
            height: 52px;
            padding: 14px 18px 8px 18px;
            border-radius: 12px;
          }

          .pink-label {
            left: 18px;
          }
        }

        /* Mejora para accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .pink-input,
          .pink-label {
            transition: none;
            animation: none;
          }
        }

        /* Dark mode support con tema rosado */
        @media (prefers-color-scheme: dark) {
          .pink-input {
            background: linear-gradient(145deg, rgba(45, 25, 35, 0.9), rgba(55, 30, 40, 0.8));
            border-color: #f472b6;
            color: #fdf2f8;
          }

          .pink-input:focus {
            border-color: #ec4899;
            background: linear-gradient(145deg, rgba(55, 30, 40, 0.95), rgba(45, 25, 35, 0.9));
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
          }

          .pink-label {
            color: #f472b6;
            background: linear-gradient(145deg, rgba(45, 25, 35, 0.9), rgba(55, 30, 40, 0.8));
          }

          .pink-input:focus + .pink-label,
          .pink-input:not(:placeholder-shown) + .pink-label {
            color: #ec4899;
            background: linear-gradient(145deg, rgba(55, 30, 40, 0.95), rgba(45, 25, 35, 0.9));
          }

          .recover-card.improved-form {
            background: linear-gradient(145deg, rgba(30, 20, 25, 0.95), rgba(20, 15, 20, 0.9));
            border: 1px solid rgba(244, 114, 182, 0.2);
            box-shadow: 0 8px 32px rgba(236, 72, 153, 0.1);
          }

          .recover-title {
            color: #fdf2f8;
            background: linear-gradient(135deg, #f472b6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .pink-input.error {
            border-color: #f87171;
            background: linear-gradient(145deg, rgba(60, 30, 30, 0.9), rgba(70, 35, 35, 0.8));
          }

          .pink-error-message {
            color: #f87171;
          }
        }
      `}</style>
    </div>
  );
};

export default RecuperacionContra;