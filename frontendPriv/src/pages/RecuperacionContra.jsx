// src/pages/RecuperacionContra.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Swal from "sweetalert2";
import "../styles/Recuperacion.css";

const RecuperacionContra = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { requestCode, loading } = useRecoverAdminPassword();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await requestCode(data.email);
      if (res.message?.includes("correctamente")) {
        Swal.fire("Éxito", res.message, "success");
        navigate("/verificar-codigo"); // pasa a la ventana para verificar
      } else {
        Swal.fire("Error", res.message || "No se pudo enviar el código.", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="recover-wrapper"
      style={{
        backgroundImage: `url("/recuperacionPriv.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      
      <div className="recover-card">
        <BackArrow to="/login" />
        <Logo />

<h2 className="recover-title">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Correo"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de correo inválido",
              },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <Button text={loading ? "Enviando..." : "Enviar código →"} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default RecuperacionContra;
