import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useRecoverCustomerPassword from "../hooks/recovery/useRecoverCustomerPassword";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import "../styles/VerificarCodigo.css";

export default function VerificarCodigo() {
  const navigate = useNavigate();
  const { verifyCode, loading } = useRecoverCustomerPassword();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { code: "" } });

  const onSubmit = async ({ code }) => {
    if (!code?.trim()) {
      Swal.fire("Código requerido", "Ingresa el código que recibiste.", "error");
      return;
    }
    const res = await verifyCode(code.trim());
    if (res.ok) {
      Swal.fire("Código verificado", res.message || "Continuemos.", "success");
      sessionStorage.setItem("rp_verified", "1");
      navigate("/cambiar");
    } else {
      const msg = res.message || "Código inválido o expirado.";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <BackArrow to="/recuperacion" />
        <Logo />
        <h2 className="verify-title">Verificar Código</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Código de confirmación"
            {...register("code", { required: "El código es obligatorio" })}
          />
          {errors.code && <p className="verify-error">{errors.code.message}</p>}
          <Button type="submit" text={loading ? "Verificando..." : "Verificar →"} />
        </form>
      </div>
    </div>
  );
}
