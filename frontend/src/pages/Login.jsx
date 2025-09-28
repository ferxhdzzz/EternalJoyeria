import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";
import OlvidarCont from "../components/registro/labelcont/LabelCont";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import "../styles/AuthStyles.css";

import useLogin from "../hooks/Auth/useLogin";

// Componente Input mejorado con tema rosado - EXACTO del ejemplo que funciona
const PinkImprovedInput = React.forwardRef(({ 
  label, 
  name,
  type = "text", 
  value,
  onChange,
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
          name={name}
          type={type}
          value={value}
          onChange={onChange}
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

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useLogin(); // ✅ usa el nuevo login hook
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
      console.log("Resultado del login:", res);

      if (res?.success) {
        Swal.fire({
          title: "¡Bienvenido/a de vuelta!",
          text: "Has iniciado sesión exitosamente.",
          icon: "success",
          confirmButtonText: "¡Genial!",
          confirmButtonColor: "#ff69b4",
        }).then(() => {
          // Pequeña pausa para asegurar que el contexto se actualice
          console.log("Redirigiendo a /perfil...");
          setTimeout(() => {
            navigate("/perfil");
          }, 100);
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
      <form className="recover-card improved-form" onSubmit={handleSubmit}>
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesión</h2>

        <div className="pink-form-fields">
          <PinkImprovedInput
            label="Correo electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <PinkImprovedInput
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        <OlvidarCont text="¿Olvidaste tu contraseña?" to="/recuperacion" />
        <Button type="submit" text={loading ? "Ingresando..." : "Ingresar →"} />
        <Label textBefore="¿No tienes cuenta?" linkText="Regístrate" to="/registro" />
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
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
          background: #fce7f3;
          transform: none;
        }

        .pink-input:hover:not(:focus) {
          border-color: #f472b6;
          background: #fce7f3;
          transform: none;
        }

        .pink-input.error {
          border-color: #f87171;
          background: #fce7f3;
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
          background: #fce7f3;
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
          background: #fce7f3;
        }

        .pink-input.error:focus + .pink-label,
        .pink-input.error:not(:placeholder-shown) + .pink-label {
          color: #ef4444;
          background: #fce7f3;
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
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
            border-color: #f472b6;
            color: #fdf2f8;
          }

          .pink-input:focus {
            border-color: #ec4899;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), hsla(0, 0%, 100%, 0.90));
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
          }

          .pink-label {
            color: #f472b6;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
          }

          .pink-input:focus + .pink-label,
          .pink-input:not(:placeholder-shown) + .pink-label {
            color: #ec4899;
            background: linear-gradient(145deg, rgba(243, 243, 243, 0.95), rgba(255, 255, 255, 0.9));
          }

          .pink-password-toggle {
            background: linear-gradient(145deg, #ec4899, #db2777);
            color: #ffffff;
          }

          .pink-password-toggle:hover {
            background: linear-gradient(145deg, #db2777, #be185d);
          }

          .recover-card.improved-form {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
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

export default Login;
