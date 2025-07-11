import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import PerfilFoto from "../components/registro/ProfilePic/PerfilFoto";
import BotonPerfil from "../components/registro/BotonPerfil/BotonPerfil";

import '../styles/AuthStyles.css';

const Registro3 = ({ formData, setFormData }) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Boton Registrarse presionado");
    console.log("Datos completos del formulario:", formData);
    
    // Aquí puedes enviar los datos al servidor
    // Por ejemplo: await registerUser(formData);
    
    navigate("/products");
  };

  const handleTomarFoto = () => {
    console.log("Boton Tomar Foto presionado");
    console.log("Datos antes de tomar foto:", formData);
    
    // Aquí implementarías la lógica para tomar foto con la cámara
    // Por ahora, simularemos que se tomó una foto
    setFormData((prevData) => ({
      ...prevData,
      img: "/foto_tomada.jpg" // Placeholder
    }));
    
    console.log("Foto simulada guardada");
  };

  const handleSubirImagen = () => {
    console.log("Boton Subir imagen presionado");
    console.log("Datos antes de subir imagen:", formData);
    
    // Crear un input file oculto
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("Archivo seleccionado:", file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prevData) => ({
            ...prevData,
            img: e.target.result // Guarda la imagen como base64
          }));
          console.log("Imagen guardada exitosamente");
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="recover-wrapper" style={{ backgroundImage: `url("/Registro/registeeer.png")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="recover-card">
        <BackArrow to="/registro2" />
        <Logo />
        <h2 className="recover-title">Registrarse</h2>
        <h4>Paso 3</h4>

        <PerfilFoto 
          src={formData.img || "/gigi.png"} 
          size={140} 
        />
        
        <div className="botones-contenedor">
          <BotonPerfil 
            text="Tomar Foto" 
            color="#CE91A5" 
            onClick={handleTomarFoto} 
          />
          <BotonPerfil 
            text="Subir imagen" 
            color="#F9A5C0" 
            onClick={handleSubirImagen} 
          />
        </div>

        <Button text="Registrarse →" onClick={handleSubmit} />
       
      </div>
    </div>
  );
};

export default Registro3;