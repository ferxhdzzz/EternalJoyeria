// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import Nav from '../components/Nav/Nav';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import '../styles/ProfileRedesign.css';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import {
  LockIcon,
  InfoIcon,
  CopyIcon,
  HistoryIcon,
  LogoutIcon,
  CheckIcon,
  XIcon
} from '../components/Icons';

const Profile = () => {
  const { logout } = useAuth();

  // Hook de perfil (usuario autenticado)
  const { user, loading, error, updateProfile, updateProfilePicture } = useProfile();

  // Estado UI
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  const [cartOpen, setCartOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [message, setMessage] = useState('');

  const [localUser, setLocalUser] = useState({
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'usuario@ejemplo.com',
    phone: '+34123456789',
    password: '**',
    language: 'Español',
    currency: 'USD',
    street: 'Calle Principal #123',
    city: 'San Salvador',
    department: 'San Salvador',
    zipCode: '1101',
    country: 'El Salvador',
  });

  useEffect(() => {
    if (user) {
      console.log('🔄 Usuario recibido del backend:', user);
      setLocalUser(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        profilePicture: user.profilePicture || prev.profilePicture,
      }));

      // Fallback de imagen
      if (user.profilePicture) {
        console.log('📸 Foto de perfil encontrada en backend:', user.profilePicture);
        setProfileImage(user.profilePicture);
      } else {
        console.log('📸 No hay foto de perfil en backend, usando imagen por defecto');
        setProfileImage('/Perfil/foto-perfil.png');
      }
    }
  }, [user]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('📸 Archivo seleccionado:', file.name, file.size);

      // Preview inmediata
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('🖼️ Imagen cargada localmente para preview');
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);

      // Subir al backend
      console.log('📤 Subiendo foto al backend...');
      const result = await updateProfilePicture(file);
      if (result.success) {
        console.log('✅ Foto subida exitosamente al backend');
        showMessage('Foto de perfil actualizada correctamente! 🎉');

        if (result.data && result.data.profilePicture) {
          console.log('🔄 Actualizando imagen con URL del backend:', result.data.profilePicture);
          setProfileImage(result.data.profilePicture);
        }
      } else {
        console.error('❌ Error al subir foto:', result.error);
        showMessage('Error al actualizar la foto: ' + result.error);

        // Revertir
        if (user && user.profilePicture) {
          setProfileImage(user.profilePicture);
        } else {
          setProfileImage('/Perfil/foto-perfil.png');
        }
      }
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(localUser[field]);
  };

  const handleSaveEdit = async (field) => {
    try {
      let updateData = {};

      if (field === 'name') {
        const nameParts = tempValue.split(' ');
        updateData.firstName = nameParts[0] || '';
        updateData.lastName = nameParts.slice(1).join(' ') || '';
      } else if (field === 'phone') {
        updateData.phone = tempValue;
      } else if (field === 'email') {
        updateData.email = tempValue;
      }

      if (Object.keys(updateData).length > 0) {
        console.log('📝 Enviando actualización al backend:', updateData);
        const result = await updateProfile(updateData);
        if (result.success) {
          setLocalUser(prev => ({ ...prev, [field]: tempValue }));
          showMessage('Perfil actualizado correctamente!');
        } else {
          showMessage('Error al actualizar: ' + result.error);
          return;
        }
      }

      setEditingField(null);
      setTempValue('');
    } catch (err) {
      console.error('❌ Error al actualizar el perfil:', err);
      showMessage('Error al actualizar el perfil');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') handleSaveEdit(field);
    else if (e.key === 'Escape') handleCancelEdit();
  };

  const handleLogout = async () => {
    const confirmResult = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e75480",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: "Cerrando sesión...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error al cerrar sesión");

      Swal.fire({
        title: "Sesión cerrada",
        text: "Serás redirigido al inicio de sesión",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => { window.location.href = "/productos"; }, 1500);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Swal.fire({ title: "Error", text: "No se pudo cerrar sesión. Intenta de nuevo.", icon: "error" });
    }
  };

  const copyAddressToClipboard = () => {
    const fullAddress = `${localUser.street}, ${localUser.city}, ${localUser.department}, ${localUser.zipCode}, ${localUser.country}`;
    navigator.clipboard.writeText(fullAddress).then(() => {
      showMessage('Dirección copiada al portapapeles');
    });
  };

  const renderField = (field, label, value, isPassword = false) => {
    if (isPassword) {
      return (
        <div className="profile-info-row">
          <div>
            <div className="profile-info-label">{label}</div>
          </div>
          <button
            className="edit-btn"
            onClick={() => window.location.href = '/recuperacion'}
          >
            <LockIcon size={14} color="white" />
            Cambiar contraseña
          </button>
        </div>
      );
    }

    const isEditing = editingField === field;

    return (
      <div className="profile-info-row">
        <div>
          <div className="profile-info-label">{label}</div>
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, field)}
              autoFocus
            />
          ) : (
            <div className="profile-info-value">{value}</div>
          )}
        </div>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="edit-btn save" onClick={() => handleSaveEdit(field)}>
              <CheckIcon size={12} color="white" />
            </button>
            <button className="edit-btn cancel" onClick={handleCancelEdit}>
              <XIcon size={12} color="white" />
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => handleEditClick(field)}>
            Editar
          </button>
        )}
      </div>
    );
  };

  /** --------- RENDER: Loading / Error / OK --------- */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error al cargar el perfil</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Principal
  return (
    <div>
      <Nav cartOpen={cartOpen} />

      {/* Toast */}
      {message && (
        <div className={`toast ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-page">
        <div className="profile-redesign-container">
          {/* Card izquierda */}
          <div className="profile-card left">
            <div className="profile-photo-section">
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="profile-avatar"
                onClick={() => document.getElementById('photo-input').click()}
              />
              <label className="update-photo-btn">
                Actualizar foto
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            <div className="profile-info-box">
              {renderField('name', 'Tu nombre', `${localUser.firstName} ${localUser.lastName}`)}
              {renderField('email', 'Tu correo', localUser.email)}
              {renderField('phone', 'Tu telefono', localUser.phone)}
              {renderField('password', 'Tu contraseña', '••••••••', true)}

              <div className="password-info-box">
                <InfoIcon size={14} color="#6c757d" />
                Para cambiar tu contraseña, haz clic en "Cambiar contraseña" y serás dirigido a la pantalla de recuperación
              </div>

              <div className="settings-section">
                <h4>Configuraciones</h4>
                <div className="profile-settings-row">
                  <div className="profile-info-label">Notificaciones</div>
                  <div className="checkbox-wrapper-5">
                    <div className="check">
                      <input
                        type="checkbox"
                        id="check-5"
                        checked={notifications}
                        onChange={() => setNotifications((n) => !n)}
                      />
                      <label htmlFor="check-5"></label>
                    </div>
                  </div>
                </div>

                <div className="profile-settings-row">
                  <div className="profile-info-label privacy-terms-link" onClick={() => window.open('/privacy', '_blank')}>
                    Política de privacidad
                  </div>
                </div>
                <div className="profile-settings-row">
                  <div className="profile-info-label privacy-terms-link" onClick={() => window.open('/terms', '_blank')}>
                    Términos y condiciones
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card derecha */}
          <div className="profile-card right">
            <div className="profile-settings-box">
              {renderField('language', 'Idioma', localUser.language)}
              {renderField('currency', 'Moneda', localUser.currency)}

              <div className="address-section">
                <h4>Información de Dirección</h4>
                {renderField('street', 'Calle y número', localUser.street)}
                {renderField('city', 'Ciudad', localUser.city)}
                {renderField('department', 'Departamento', localUser.department)}
                {renderField('zipCode', 'Código postal', localUser.zipCode)}
                {renderField('country', 'País', localUser.country)}

                <button
                  className="copy-address-btn"
                  onClick={copyAddressToClipboard}
                >
                  <CopyIcon size={14} color="#222" />
                  Copiar dirección completa
                </button>
              </div>

              <div className="profile-settings-row">
                <button
                  className="order-history-btn"
                  onClick={() => window.location.href = '/historial'}
                >
                  <HistoryIcon size={16} color="currentColor" />
                  Historial de pedidos
                </button>
              </div>
              <div className="profile-settings-row">
                <button
                  className="order-history-btn"
                  onClick={() => window.location.href = '/histReview'}
                >
                  <HistoryIcon size={16} color="currentColor" />
                  Historial de reseñas
                </button>
              </div>
              <div className="profile-settings-row">
                <button className="logout-btn" onClick={handleLogout}>
                  <LogoutIcon size={16} color="currentColor" />
                  Desconectarse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;