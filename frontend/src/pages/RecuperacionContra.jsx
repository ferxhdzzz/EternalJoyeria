import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useRecoverCustomerPassword from "../hooks/recovery/useRecoverCustomerPassword";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import "../styles/Recuperacion.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecuperacionContra() {
  const navigate = useNavigate();
  const { requestCode, loading } = useRecoverCustomerPassword();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: "" } });

  const onSubmit = async ({ email }) => {
    if (!emailRegex.test(email)) {
      Swal.fire("Correo inválido", "Revisa el formato del correo.", "error");
      return;
    }
    const res = await requestCode(email);
    if (res.ok) {
      Swal.fire("Código enviado", res.message || "Revisa tu correo.", "success");
      sessionStorage.setItem("rp_email", email);
      navigate("/verificar-codigo");
    } else {
      const msg = res.message || (res.status === 404 ? "El correo no existe." : "No se pudo enviar el código.");
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
        <BackArrow to="/login" />
        <Logo />
        <h2 className="recover-title">Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Correo"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: emailRegex, message: "Formato de correo inválido" },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
          <Button type="submit" text={loading ? "Enviando..." : "Enviar código →"} />
        </form>
      </div>
    </div>
  );
}
