import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAdminAuth } from "../context/AdminAuthContext";

import Logo from "../components/registro/logo/Logo";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import OlvidarCont from "../components/registro/labelcont/LabelCont";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/Recuperacion.css";

// Componente Input mejorado con tema rosado
const PinkImprovedInput = React.forwardRef(({ 
  label, 
  type = "text", 
  error, 
  showPasswordToggle = false, 
  onTogglePassword,
  showPassword = false,
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
        {showPasswordToggle && (
          <button
            type="button"
            className="pink-password-toggle"
            onClick={onTogglePassword}
            tabIndex={-1}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="pink-error-message">{error}</span>}
    </div>
  );
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateAuthStatus } = useAdminAuth();

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

      // Actualizar el estado de autenticación después del login exitoso
      const isAuthUpdated = await updateAuthStatus();
      
      if (isAuthUpdated) {
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido/a de vuelta!",
          text: "Has iniciado sesión exitosamente.",
        }).then(() => {
          console.log("Redirigiendo a /dashboard...");
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "No se pudo verificar el estado de administrador.",
        });
      }
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
      <form className="recover-card improved-form" onSubmit={handleSubmit(onSubmit)}>
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesión</h2>

        <div className="pink-form-fields">
          <PinkImprovedInput
            label="Correo electrónico"
            type="email"
            error={errors.email?.message}
            {...register("email", { 
              required: "El correo es obligatorio.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo válido"
              }
            })}
          />

          <PinkImprovedInput
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            {...register("password", { 
              required: "La contraseña es obligatoria.",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              }
            })}
          />
        </div>

        <OlvidarCont text="¿Olvidaste tu contraseña?" to="/recuperacion" />
        <Button type="submit" text="Ingresar →" />
      </form>

      <style>{`
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

        .pink-password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(145deg, #f472b6, #ec4899);
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(236, 72, 153, 0.2);
        }

        .pink-password-toggle:hover {
          background: linear-gradient(145deg, #ec4899, #db2777);
          box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
          transform: translateY(-50%) scale(1.05);
        }

        .pink-password-toggle:active {
          transform: translateY(-50%) scale(0.95);
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
          content: "⚠️";
          font-size: 12px;
        }

        .pink-form-fields {
          width: 100%;
          margin: 24px 0;
        }

        .improved-form {
          padding: 24px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(248, 187, 217, 0.3);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 10px 10px -5px rgba(0, 0, 0, 0.04),
                      0 0 0 1px rgba(236, 72, 153, 0.05);
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
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.97);
          }

          .recover-title {
            font-size: 24px;
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

          .pink-password-toggle {
            padding: 6px;
            border-radius: 6px;
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
            border-radius: 18px;
          }

          .pink-input {
            height: 52px;
            padding: 14px 18px 8px 18px;
            border-radius: 12px;
          }

          .pink-label {
            left: 18px;
          }

          .pink-password-toggle {
            right: 14px;
            padding: 6px;
          }
        }

        /* Mejora para accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .pink-input,
          .pink-label,
          .pink-password-toggle {
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

          .pink-password-toggle {
            background: linear-gradient(145deg, #ec4899, #db2777);
            color: #ffffff;
          }

          .pink-password-toggle:hover {
            background: linear-gradient(145deg, #db2777, #be185d);
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
}