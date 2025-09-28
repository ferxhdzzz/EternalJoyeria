import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import useRecoverCustomerPassword from "../hooks/recovery/useRecoverCustomerPassword";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import "../styles/Recuperacion.css";

const hasSpecial = (s) => /[!@#$%^&*(),.?":{}|<>]/.test(s);

export default function CambiarCont() {
  const navigate = useNavigate();
  const { resetPassword } = useRecoverCustomerPassword();

  useEffect(() => {
    if (sessionStorage.getItem("rp_verified") !== "1") {
      Swal.fire("Acceso no válido", "Primero verifica tu código.", "warning")
        .then(() => navigate("/recuperacion"));
    }
  }, [navigate]);

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    const { password, confirmPassword } = form;
    const newErr = { password: "", confirmPassword: "" };
    let invalid = false;

    if (!password) {
      newErr.password = "Complete todos los campos."; invalid = true;
    } else {
      if (password.length < 8) { newErr.password = "Debe tener al menos 8 caracteres."; invalid = true; }
      if (!hasSpecial(password)) { newErr.password = "Debe incluir al menos un carácter especial."; invalid = true; }
    }

    if (!confirmPassword) { newErr.confirmPassword = "Confirma tu contraseña."; invalid = true; }
    else if (confirmPassword !== password) { newErr.confirmPassword = "Las contraseñas no coinciden."; invalid = true; }

    setErrors(newErr);
    if (invalid) {
      Swal.fire("Revisa los campos", "Corrige las validaciones marcadas.", "error");
      return;
    }

    console.log("Contraseña a enviar:", password);
    console.log("Longitud:", password.length);
    console.log("Tiene carácter especial:", hasSpecial(password));

    const res = await resetPassword(password);
    
    console.log("Respuesta completa de resetPassword:", res);
    console.log("res.ok:", res.ok);
    console.log("res.status:", res.status);
    console.log("res.message:", res.message);

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: res.message || "Contraseña actualizada correctamente.",
        confirmButtonText: "Ir al login",
      }).then(() => {
        sessionStorage.removeItem("rp_email");
        sessionStorage.removeItem("rp_verified");
        navigate("/login");
      });
    } else {
      const msg = res.message || "No se pudo actualizar.";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/recuperacionPriv.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        <BackArrow to="/verificar-codigo" />
        <Logo />
        <h2 className="recover-title">Recuperar contraseña</h2>

        <div className="input-group-eye">
          <Input
            label="Nueva Contraseña"
            name="password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowPass((v) => !v)}>
            {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}

        <div className="input-group-eye">
          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span className="eye-icon" onClick={() => setShowConfirm((v) => !v)}>
            {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        <Button text="Actualizar →" onClick={handleSubmit} />
      </div>
    </div>
  );
}
