import { useState } from "react";

const API_URL = "http://localhost:4000/api/registerClients";

export default function useRegistration() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Paso 1
    firstName: '',
    lastName: '',
    user: '',
    // Paso 2
    email: '',
    phone: '',
    password: '',
    country: 'sv',
    // Paso 3
    profilePicture: null,
    profilePicturePreview: null
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const registerClient = async () => {
    setLoading(true);
    const data = new FormData();
    
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('user', formData.user); // ✅ Agregado
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('phone', formData.phone);
    
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: data,
      });
      
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const verifyEmailCode = async (verificationCode) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ verificationCode }),
      });
      
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // ✅ Nueva función para reenviar código
  const resendVerificationCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });
      
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Solo se permiten archivos PNG, JPG o JPEG');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('El archivo debe ser menor a 5MB');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData({
          profilePicture: file,
          profilePicturePreview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const errors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const userRegex = /^\S*$/;

    if (!formData.firstName.trim()) {
      errors.firstName = "El nombre es obligatorio.";
    } else if (!nameRegex.test(formData.firstName)) {
      errors.firstName = "El nombre solo puede contener letras.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "El apellido es obligatorio.";
    } else if (!nameRegex.test(formData.lastName)) {
      errors.lastName = "El apellido solo puede contener letras.";
    }

    if (!formData.user.trim()) {
      errors.user = "El usuario es obligatorio.";
    } else if (!userRegex.test(formData.user)) {
      errors.user = "El usuario no puede contener espacios.";
    }

    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const phoneRegex = /^\d+$/;

    if (!formData.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Correo no válido.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "El teléfono es obligatorio.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Solo números.";
    } else {
      if (formData.country === "sv" && formData.phone.length !== 8) {
        errors.phone = "Debe tener 8 dígitos para El Salvador.";
      } else if (formData.country === "us" && formData.phone.length !== 10) {
        errors.phone = "Debe tener 10 dígitos para EE.UU.";
      }
    }

    if (!formData.password.trim()) {
      errors.password = "La contraseña es obligatoria.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Debe tener al menos 8 caracteres y un carácter especial.";
    }

    return errors;
  };

  return {
    formData,
    loading,
    updateFormData,
    registerClient,
    verifyEmailCode,
    resendVerificationCode, // ✅ Exportar nueva función
    handleImageUpload,
    validateStep1,
    validateStep2
  };
}