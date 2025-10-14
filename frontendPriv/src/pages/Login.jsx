import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// ✅ AÑADIDO: Importación del hook de autenticación que faltaba.
import { useAdminAuth } from "../context/AdminAuthContext"; 

import Logo from "../components/registro/logo/Logo";
import BackArrow from "../components/registro/backarrow/BackArrow";
import OlvidarCont from "../components/registro/labelcont/LabelCont";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/Recuperacion.css";
import "../styles/shared/buttons.css"; // ✅ AÑADIDO: Import de tus estilos de botón

// ✅ INTEGRADO: Componente de input avanzado de la rama master
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
  // ✅ CORREGIDO: Esta línea ahora funcionará gracias a la importación
  const { updateAuthStatus } = useAdminAuth(); 

  // ✅ CAMBIO: Lógica completa de onSubmit, traída de la rama master
  const onSubmit = async (data) => {
    try {
      // Usando la URL de producción de master
      const response = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/login", {
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

      // Lógica crucial para actualizar el estado de autenticación
      const isAuthUpdated = await updateAuthStatus();
      
      if (isAuthUpdated) {
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido/a de vuelta!",
          text: "Has iniciado sesión exitosamente.",
        }).then(() => {
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

        {/* ✅ CAMBIO: Usando los inputs mejorados de master con validación completa */}
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

        {/* ✅ MANTENIDO: Tu diseño de botón personalizado */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button type="submit" className="ej-btn ej-approve">
            Ingresar →
          </button>
        </div>
      </form>
      <style>{`
        /* Tus estilos para los inputs rosados y todo lo demás van aquí... */
        /* (El bloque <style> es idéntico al que me pasaste, así que lo omito por brevedad,
           pero debe estar aquí en tu archivo final) */
        .pink-input-container { margin-bottom: 20px; width: 100%; }
        .pink-input-wrapper { position: relative; width: 100%; }
        .pink-input { width: 100%; height: 56px; padding: 16px 16px 8px 16px; border: 2px solid #f8bbd9; border-radius: 16px; font-size: 16px; font-family: inherit; background: linear-gradient(145deg, #fef7f7, #fff0f3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); outline: none; box-sizing: border-box; color: #4a4a4a; }
        .pink-input:focus { border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2); background: #fce7f3; transform: none; }
        .pink-input:hover:not(:focus) { border-color: #f472b6; background: #fce7f3; transform: none; }
        .pink-input.error { border-color: #f87171; background: #fce7f3; animation: shake 0.5s ease-in-out; }
        .pink-input.error:focus { box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.15); border-color: #ef4444; }
        .pink-input::placeholder { color: #d1a3a3; }
        .pink-label { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; color: #be185d; pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: #fce7f3; padding: 0 6px; border-radius: 6px; font-weight: 500; }
        .pink-input:focus + .pink-label, .pink-input:not(:placeholder-shown) + .pink-label { top: -2px; font-size: 12px; font-weight: 600; color: #ec4899; transform: translateY(0) scale(0.95); background: #fce7f3; }
        .pink-input.error:focus + .pink-label, .pink-input.error:not(:placeholder-shown) + .pink-label { color: #ef4444; background: #fce7f3; }
        .pink-password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: linear-gradient(145deg, #f472b6, #ec4899); border: none; color: #ffffff; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(236, 72, 153, 0.2); }
        .pink-password-toggle:hover { background: linear-gradient(145deg, #ec4899, #db2777); box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3); transform: translateY(-50%) scale(1.05); }
        .pink-password-toggle:active { transform: translateY(-50%) scale(0.95); }
        .pink-error-message { display: flex; align-items: center; gap: 6px; color: #ef4444; font-size: 14px; margin-top: 6px; margin-left: 4px; font-weight: 500; animation: slideInDown 0.3s ease-out; }
        .pink-error-message::before { content: "⚠️"; font-size: 12px; }
        .pink-form-fields { width: 100%; margin: 24px 0; }
        /* ... y el resto de tus estilos ... */
      `}</style>
    </div>
  );
}