import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/registro/logo/Logo";
import Button from "../components/registro/button/Button";
import BackArrow from "../components/registro/backarrow/BackArrow";
import PerfilFoto from "../components/registro/ProfilePic/PerfilFoto";
import BotonPerfil from "../components/registro/BotonPerfil/BotonPerfil";
import '../styles/AuthStyles.css';

const RegistroPaso2 = ({ prevStep, registration }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { formData, handleImageUpload, loading } = registration;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        handleImageUpload(file);
        setImageError('');
      } catch (error) {
        setImageError(error.message);
      }
    }
  };

  const handleTakePhoto = () => {
    // Implementar funcionalidad de cámara más adelante
    alert('Funcionalidad de cámara próximamente disponible');
  };

  const updateProfilePicture = async () => {
    if (!formData.profilePicture) return true;
    
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('profilePicture', formData.profilePicture);
      
      const response = await fetch('http://localhost:3000/api/registerClients/update-profile-picture', {
        method: 'POST',
        credentials: 'include', // Para enviar cookies de sesión
        body: data,
      });
      
      const result = await response.json();
      setIsUploading(false);
      
      return response.ok;
    } catch (error) {
      setIsUploading(false);
      setImageError('Error al subir la imagen');
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      // Si hay una imagen, intentar subirla
      if (formData.profilePicture) {
        const uploadSuccess = await updateProfilePicture();
        if (!uploadSuccess) {
          setImageError('Error al subir la imagen. Intenta nuevamente.');
          return;
        }
      }
      
      // Redirigir a verificación de email o productos
      navigate("/verify-email"); // o "/products" si no necesitas verificación
      
    } catch (error) {
      setImageError('Error inesperado. Intenta nuevamente.');
    }
  };

  const handleBack = () => {
    if (prevStep) {
      prevStep();
    } else {
      navigate("/registro2");
    }
  };

  return (
    <div className="recover-wrapper" style={{ 
      backgroundImage: `url("/Registro/registeeer.png")`, 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat" 
    }}>
      <div className="recover-card">
        <BackArrow onClick={handleBack} />
        <Logo />
        <h2 className="recover-title">Registrarse</h2>
        <h4>Paso 3</h4>

        <PerfilFoto 
          src={formData?.profilePicturePreview || "/gigi.png"} 
          size={140} 
        />
        
        {imageError && <p className="error">{imageError}</p>}
        
        <div className="botones-contenedor">
          <BotonPerfil 
            text="Tomar Foto" 
            color="#CE91A5" 
            onClick={handleTakePhoto}
            disabled={loading || isUploading}
          />
          <BotonPerfil 
            text="Subir imagen" 
            color="#F9A5C0" 
            onClick={handleFileSelect}
            disabled={loading || isUploading}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: 'none' }}
        />

        <Button 
          text={isUploading ? "Subiendo..." : "Registrarse →"} 
          onClick={handleSubmit}
          disabled={loading || isUploading}
        />
      </div>
    </div>
  );
};

export default RegistroPaso2;