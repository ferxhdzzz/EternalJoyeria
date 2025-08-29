import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Swal from "sweetalert2";
import "../styles/AuthStyles.css";

const RecoverPasswordAdmin = () => {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El correo no es válido.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "https://eternaljoyeria-cg5d.onrender.com/api/recoveryPassword/admin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          Swal.fire({
            title: "Error",
            text: result.message || "No se pudo enviar el correo",
            icon: "error",
            confirmButtonColor: "#ff69b4",
          });
          return;
        }

        Swal.fire({
          title: "¡Correo enviado!",
          text: "Revisa tu bandeja para continuar la recuperación.",
          icon: "success",
          confirmButtonColor: "#ff69b4",
        }).then(() => {
          navigate("/cambiar"); // Ruta para verificar código y cambiar contraseña
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Error de conexión con el servidor",
          icon: "error",
          confirmButtonColor: "#ff69b4",
        });
      }
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/fondoEternal.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        <BackArrow to="/login" />
        <Logo />
        <h2 className="recover-title">Recuperar Contraseña Admin</h2>

        <Input
          label="Correo"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <Button text="Enviar código →" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default RecoverPasswordAdmin;
