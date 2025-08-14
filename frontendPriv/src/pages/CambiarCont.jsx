import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword";
import "../styles/Recuperacion.css";

const CambiarContra = () => {
  // Estado para guardar los valores del formulario (password y confirmPassword)
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  
  // Estado para guardar los mensajes de error de validación para cada campo
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  
  // Estado para mostrar/ocultar la contraseña del campo 'password'
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para mostrar/ocultar la contraseña del campo 'confirmPassword'
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Hook de react-router-dom para navegación programática
  const navigate = useNavigate();
  
  // Hook personalizado que provee la función para actualizar la contraseña en backend
  const { newPassword } = useRecoverAdminPassword();

  // Maneja los cambios en los inputs, actualizando el estado 'form'
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Función que se ejecuta al enviar el formulario para validar y actualizar la contraseña
  const handleSubmit = async () => {
    const { password, confirmPassword } = form;
    
    // Inicializa el objeto para errores y un flag para saber si hay error
    let newErrors = { password: "", confirmPassword: "" };
    let hasError = false;

    // Validación: campo password obligatorio, mínimo 8 caracteres, un carácter especial
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

    // Validación: campo confirmPassword obligatorio y debe coincidir con password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
      hasError = true;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      hasError = true;
    }

    // Actualiza el estado de errores para mostrar mensajes en la UI
    setErrors(newErrors);

    // Si hay error, termina aquí la función y no continúa con el envío
    if (hasError) return;

    try {
      // Llama a la función para actualizar la contraseña en backend
      const result = await newPassword(password);
      
      // Si la actualización fue exitosa, muestra alerta y redirige al login
      if (result.message === "Contraseña actualizada correctamente.") {
        Swal.fire({
          icon: "success",
          title: "¡Listo!",
          text: result.message,
          confirmButtonText: "Ir al login"
        }).then(() => navigate("/login"));
      } else {
        // Si hubo un problema en backend, muestra alerta de error con mensaje recibido
        Swal.fire("Error", result.message || "No se pudo actualizar.", "error");
      }
    } catch (error) {
      // Si hay error inesperado (ej. fallo de red), muestra alerta genérica
      Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
    }
  };

  // Renderizado del formulario y componentes visuales
  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/recuperacionPriv.png")`, // Imagen de fondo
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        {/* Botón para regresar a la pantalla anterior */}
        <BackArrow to="/recuperacion" />
        
        {/* Logo del sitio */}
        <Logo />
        
        {/* Título principal */}
        <h2 className="recover-title">Recuperar contraseña</h2>

        {/* Campo de entrada para la nueva contraseña */}
        <div className="input-group-eye">
          <Input
            label="Nueva Contraseña"
            name="password"
            type={showPassword ? "text" : "password"} // Alterna entre mostrar y ocultar contraseña
            value={form.password}
            onChange={handleChange}
          />
          {/* Icono para mostrar u ocultar la contraseña */}
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {/* Mensaje de error para contraseña */}
        {errors.password && <p className="error-message">{errors.password}</p>}

        {/* Campo de entrada para confirmar la contraseña */}
        <div className="input-group-eye">
          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"} // Alterna visibilidad
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {/* Icono para mostrar u ocultar la confirmación */}
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {/* Mensaje de error para confirmación */}
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        {/* Botón para enviar el formulario */}
        <Button text="Actualizar →" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default CambiarContra;
