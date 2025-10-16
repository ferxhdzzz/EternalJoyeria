import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword";
import "../styles/Recuperacion.css";

// Componente Input mejorado con tema rosado y ojo dentro
const PinkImprovedInput = React.forwardRef(
  ({ label, type = "text", error, showEye, toggleEye, ...props }, ref) => {
    return (
      <div className="pink-input-container">
        <div className="pink-input-wrapper">
          <input
            ref={ref}
            type={type}
            className={`pink-input ${error ? "error" : ""}`}
            placeholder=" "
            {...props}
          />
          <label className="pink-label">{label}</label>

          {/* Icono de ojo dentro del input */}
          {showEye !== undefined && (
            <span className="eye-icon-inside" onClick={toggleEye}>
              {showEye ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          )}
        </div>
        {error && <span className="pink-error-message">{error}</span>}
      </div>
    );
  }
);

const CambiarContra = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { newPassword } = useRecoverAdminPassword();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    const { password, confirmPassword } = form;
    let newErrors = { password: "", confirmPassword: "" };
    let hasError = false;

    if (!password) {
      newErrors.password = "Complete todos los campos.";
      hasError = true;
    } else {
      if (password.length < 8) {
        newErrors.password = "Debe tener al menos 8 caracteres.";
        hasError = true;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = "Debe incluir al menos un carácter especial.";
        hasError = true;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
      hasError = true;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const result = await newPassword(password);
      if (result.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Listo!",
          text: "Contraseña actualizada correctamente.",
          confirmButtonText: "Ir al login",
        }).then(() => navigate("/login"));
      } else {
        Swal.fire("Error", result.message || "No se pudo actualizar la contraseña.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la contraseña. Error de conexión o inesperado.", "error");
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{ backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    >
      <div className="recover-card">
        <BackArrow to="/recuperacion" />
        <Logo />
        <h2 className="recover-title">Recuperar contraseña</h2>

        <div className="pink-form-fields">
          <PinkImprovedInput
            label="Nueva Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            showEye={showPassword}
            toggleEye={() => setShowPassword(!showPassword)}
          />

          <PinkImprovedInput
            label="Confirmar contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            showEye={showConfirmPassword}
            toggleEye={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <Button text="Actualizar →" onClick={handleSubmit} />
      </div>

      <style jsx>{`

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
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
          color: #4a4a4a;
        }

        .pink-input:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15), 
                      0 4px 12px rgba(236, 72, 153, 0.1);
          background: linear-gradient(145deg, #ffffff, #fef7f7);
          transform: translateY(-1px);
        }

        .pink-input:hover:not(:focus) {
          border-color: #f472b6;
          box-shadow: 0 2px 8px rgba(244, 114, 182, 0.1);
        }

        .pink-input.error {
          border-color: #f87171;
          background: linear-gradient(145deg, #fef2f2, #fff5f5);
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
          transition: all 0.3s ease;
          background: linear-gradient(145deg, #fef7f7, #fff0f3);
          padding: 0 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .pink-input:focus + .pink-label,
        .pink-input:not(:placeholder-shown) + .pink-label {
          top: -2px;
          font-size: 12px;
          font-weight: 600;
          color: #ec4899;
          transform: translateY(0);
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
        }

        .pink-error-message::before {
          content: "⚠️";
          font-size: 12px;
        }

        .pink-form-fields {
          width: 100%;
          margin: 24px 0;
        }

        /* Mejoras para el contenedor principal */
        .verify-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .verify-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 10px 10px -5px rgba(0, 0, 0, 0.04),
                      0 0 0 1px rgba(236, 72, 153, 0.05);
          width: 100%;
          max-width: 420px;
          position: relative;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(248, 187, 217, 0.3);
        }

        .verify-title {
          text-align: center;
          margin-bottom: 2rem;
          color: #be185d;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #be185d, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Responsive para móvil */
        @media (max-width: 768px) {
          .verify-card {
            margin: 20px;
            padding: 24px 20px;
            border-radius: 18px;
          }

          .verify-title {
            font-size: 1.5rem;
            margin: 16px 0 24px 0;
          }

          .pink-input {
            height: 54px;
            font-size: 16px;
            border-radius: 14px;
          }

          .pink-input:focus {
            transform: translateY(-0.5px);
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
          .verify-wrapper {
            padding: 10px;
          }

          .verify-card {
            margin: 10px;
            padding: 20px 16px;
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
          .code-input {
            transition: none;
            animation: none;
          }
        }

        /* Dark mode para inputs de código */
        @media (prefers-color-scheme: dark) {
          .code-input {
            background: linear-gradient(145deg, rgba(45, 25, 35, 0.9), rgba(55, 30, 40, 0.8));
            border-color: #f472b6;
            color: #fdf2f8;
          }

          .code-input:focus {
            border-color: #ec4899;
            background: linear-gradient(145deg, rgba(55, 30, 40, 0.95), rgba(45, 25, 35, 0.9));
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
          }

          .code-label {
            color: #f472b6;
          }

          .code-input.error {
            border-color: #f87171;
            background: linear-gradient(145deg, rgba(60, 30, 30, 0.9), rgba(70, 35, 35, 0.8));
          }



        .pink-input-wrapper {
          position: relative;
          width: 100%;
        }

        .eye-icon-inside {
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          cursor: pointer;
          color: #be185d;
          font-size: 1.4rem;
          transition: color 0.3s;
        }

        .eye-icon-inside:hover {
          color: #ec4899;
        }
      `}</style>
    </div>
  );
};

export default CambiarContra;
