import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import PerfilFoto from "../components/registro/ProfilePic/PerfilFoto";
import BotonPerfil from "../components/registro/BotonPerfil/BotonPerfil";

import '../styles/AuthStyles.css';

const RegistroPaso2 = () => {
  const [form, setForm] = useState({
   img: ""
   
  });
 const navigate = useNavigate();

  const handleSubmit = () => {
   
      navigate("/products");
    
  };

  return (
    <div className="recover-wrapper" style={{ backgroundImage: `url("/registeeer.png")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="recover-card">
        <BackArrow to="/registro2" />
        <Logo />
        <h2 className="recover-title">Registrarse 
        </h2>
        <h4>Paso 3</h4>

     <PerfilFoto src="/gigi.png" size={140} />
     <div className="botones-contenedor">
  <BotonPerfil text="Tomar Foto" color="#CE91A5" onClick={() => console.log("Tomar Foto")} />
  <BotonPerfil text="Subir imagen" color="#F9A5C0" onClick={() => console.log("Subir imagen")} />
</div>

        <Button text="Registrarse →" onClick={handleSubmit} />
       
      </div>
    </div>
  );
};

export default RegistroPaso2;
