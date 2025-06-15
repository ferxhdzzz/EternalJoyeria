import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import Label from "../components/registro/labels/LabelLog";
import OlvidarCont from "../components/registro/labelcont/LabelCont";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import '../styles/Recuperacion.css';



const Login = () => {
  const [form, setForm] = useState({ email: "", code: "" });
  const [errors, setErrors] = useState({ email: "", code: "" });
const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };




  const handleSubmit = () => {
    const { email, code } = form;
    let newErrors = { email: "", code: "" };
    let hasError = false;

    // Validar correo
    if (!email) {
      newErrors.email = "Complete todos los campos";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El correo no es válido.";
      hasError = true;
    }

    // Validar contraseña
    if (!code) {
      newErrors.code = "Complete todos los campos";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // Si no hay errores, redirige
    navigate("/products");
  };


  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/loginneternal.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="recover-card">
        <BackArrow to="/" />
        <Logo />
        <h2 className="recover-title">Iniciar sesion</h2>

        
        <Input
          label="Correo"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

<div className="input-group-eye">
 <Input
          label="Contraseña"
          name="code"
               type={showPassword ? "text" : "password"}
          value={form.code}
          onChange={handleChange}
        />
 <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
</div>
       
        {errors.code && <p className="error-message">{errors.code}</p>}
        <OlvidarCont
          text="¿Olvidaste tu contraseña?"
          to="/recuperacion"
        />
        <Button text="      Ingresar        →      " onClick={handleSubmit} />
        <Label
          textBefore="¿No tienes cuenta?"
          linkText="     Regístrate       "
          to="/registro"
        />
      </div>


    </div>
  );
};

export default Login;
