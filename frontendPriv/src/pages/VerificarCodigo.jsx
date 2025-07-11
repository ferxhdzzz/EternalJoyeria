import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword";
import Swal from "sweetalert2";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import "../styles/VerificarCodigo.css"; // tu CSS nuevo

export default function VerificarCodigo() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { verifyCode, loading } = useRecoverAdminPassword();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await verifyCode(data.code);
    if (res.message?.includes("verificado")) {
      Swal.fire("Código correcto", res.message, "success");
      navigate("/cambiar");
    } else {
      Swal.fire("Error", res.message || "Código inválido.", "error");
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
            {...register("code", {
              required: "El código es obligatorio",
            })}
          />
          {errors.code && <p className="verify-error">{errors.code.message}</p>}

          <Button text={loading ? "Verificando..." : "Verificar →"} type="submit" />
        </form>
      </div>
    </div>
  );
}
