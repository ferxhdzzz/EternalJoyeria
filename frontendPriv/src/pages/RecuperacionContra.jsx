import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Swal from "sweetalert2";
import useRecoverAdminPassword from "../hooks/recovery/useRecoverAdminPassword";
import "../styles/Recuperacion.css";

const RecoverPassword = () => {
  const [form, setForm] = useState({ email: "", code: "" });
  const [errors, setErrors] = useState({ email: "", code: "" });
  const navigate = useNavigate();
  const { requestCode, verifyCode } = useRecoverAdminPassword();
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRequestCode = async () => {
    let newErrors = { email: "" };
    let hasError = false;

    if (!form.email) {
      newErrors.email = "El correo es obligatorio.";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El correo no es válido.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const result = await requestCode(form.email);
      Swal.fire("Éxito", result.message, "success");
      setStep(2);
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el código", "error");
    }
  };

  const handleVerifyCode = async () => {
    let newErrors = { code: "" };
    let hasError = false;

    if (!form.code) {
      newErrors.code = "El código es obligatorio.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const result = await verifyCode(form.code);
      Swal.fire("Éxito", result.message, "success").then(() =>
        navigate("/cambiar")
      );
    } catch (error) {
      Swal.fire("Error", "Código inválido o expirado", "error");
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

        {step === 1 && (
          <>
            <Input
              label="Correo"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
            <Button text="Enviar código →" onClick={handleRequestCode} />
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Código de confirmación"
              name="code"
              value={form.code}
              onChange={handleChange}
            />
            {errors.code && <p className="error-message">{errors.code}</p>}
            <Button text="Verificar código →" onClick={handleVerifyCode} />
          </>
        )}
      </div>
    </div>
  );
};

export default RecoverPassword;
