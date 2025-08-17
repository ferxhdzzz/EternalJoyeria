import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2"; // ✅ Import agregado
import Nav from '../components/Nav/Nav';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfilePhotoSection from '../components/Profile/ProfilePhotoSection';
import SidebarCart from '../components/Cart/SidebarCart';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import '../styles/ProfileRedesign.css';
import { useProfile } from '../hooks/useProfile';
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
  const userId = '689d1c2f2275a3a55cbe4f1c';
  const { user, loading, error, updateProfile, updateProfilePicture } = useProfile(userId);

  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  const [cartOpen, setCartOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [message, setMessage] = useState('');

  const [localUser, setLocalUser] = useState({
    firstName: 'fer',
    lastName: 'fer',
    email: 'fjsdeveloper1@gmail.com',
    phone: '+34123456789',
    password: '****',
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
      setLocalUser(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        profilePicture: user.profilePicture || prev.profilePicture,
      }));

      if (user.profilePicture) {
        setProfileImage(user.profilePicture);
      }
    }
  }, [user]);

  const showMessage = (text, isError = false) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);

      const result = await updateProfilePicture(file);
      if (result.success) {
        showMessage('Foto de perfil actualizada correctamente!');
      } else {
        showMessage('Error al actualizar la foto: ' + result.error, true);
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
        const result = await updateProfile(updateData);
        if (result.success) {
          setLocalUser(prev => ({
            ...prev,
            [field]: tempValue
          }));
          showMessage('Perfil actualizado correctamente!');
        } else {
          showMessage('Error al actualizar: ' + result.error, true);
          return;
        }
      }

      setEditingField(null);
      setTempValue('');
    } catch (error) {
      showMessage('Error al actualizar el perfil', true);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      handleSaveEdit(field);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
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
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Error al cerrar sesión");

      Swal.fire({
        title: "Sesión cerrada",
        text: "Serás redirigido al inicio de sesión",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "/productos";
      }, 1500);

    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cerrar sesión. Intenta de nuevo.",
        icon: "error"
      });
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
        <div className="profile-info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div className="profile-info-label" style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
          </div>
          <button
            className="edit-btn"
            style={{
              background: '#eab5c5',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => window.location.href = '/recoveryPassword'}
          >
            <LockIcon size={14} color="white" />
            Cambiar contraseña
          </button>
        </div>
      );
    }

    const isEditing = editingField === field;

    return (
      <div className="profile-info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div className="profile-info-label" style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, field)}
              style={{
                border: '2px solid #F0EFFA',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '15px',
                fontWeight: '600'
              }}
              autoFocus
            />
          ) : (
            <div className="profile-info-value" style={{ fontWeight: 700, fontSize: 15 }}>
              {value}
            </div>
          )}
        </div>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="edit-btn"
              style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => handleSaveEdit(field)}
            >
              <CheckIcon size={12} color="white" />
            </button>
            <button
              className="edit-btn"
              style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={handleCancelEdit}
            >
              <XIcon size={12} color="white" />
            </button>
          </div>
        ) : (
          <button
            className="edit-btn"
            style={{ background: '#F0EFFA', color: '#222', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            onClick={() => handleEditClick(field)}
          >
            Editar
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!error) {
    return <div>Error al cargar perfil</div>;
  }
  // Mostrar pantalla de carga mientras se cargan los datos
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff'
      }}>
        <div className="loading" style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200px 100%',
          animation: 'shimmer 1.5s infinite'
        }}></div>
      </div>
    );
  }

  // Mostrar error si algo salió mal
  if (!error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Error al cargar el perfil </h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            background: '#eab5c5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Render principal de la página de perfil
  return (
    <div>
      <Nav cartOpen={cartOpen} />
      
      {/* Mensaje de éxito/error */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: message.includes('Error') ? '#f44336' : '#4CAF50',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          zIndex: 10000,
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'slideIn 0.3s ease'
        }}>
          {message}
        </div>
      )}
      
      <div className="profile-page" style={{minHeight: '100vh', background: '#fff', marginTop: '180px'}}>
        <div className="profile-redesign-container" style={{display: 'flex', gap: '2.5rem', justifyContent: 'center', alignItems: 'flex-start', marginTop: '-40px'}}>
          {/* Card izquierda: datos personales */}
          <div className="profile-card left" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px #eab5c555', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 520, minHeight: 420}}>
            <div className="profile-photo-section" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 18}}>
              <img 
                src={profileImage} 
                alt="Foto de perfil" 
                className="profile-avatar" 
                style={{width: 110, height: 110, borderRadius: '50%', objectFit: 'cover'}}
                onClick={() => document.getElementById('photo-input').click()}
              />
              <label className="update-photo-btn" style={{background: '#F0EFFA', color: '#222', borderRadius: 8, padding: '4px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none'}}>
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
              
              {/* Mensaje informativo sobre la contraseña */}
              <div style={{
                marginTop: 8,
                padding: '8px 12px',
                background: '#f8f9fa',
                borderRadius: 6,
                border: '1px solid #e9ecef',
                fontSize: 12,
                color: '#6c757d',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <InfoIcon size={14} color="#6c757d" />
                Para cambiar tu contraseña, haz clic en "Cambiar contraseña" y serás dirigido a la pantalla de recuperación
              </div>
              
              {/* Sección de configuraciones adicionales */}
              <div style={{marginTop: 20, paddingTop: 15, borderTop: '1px solid #f0f0f0'}}>
                <h4 style={{fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 15}}>Configuraciones</h4>
               
                {/* Switch de notificaciones */}
                <div className="profile-settings-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <div className="profile-info-label" style={{fontWeight: 500, fontSize: 14}}>Notificaciones</div>
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
                
                {/* Enlaces a políticas */}
                <div className="profile-settings-row" style={{marginBottom: 12}}>
                  <div className="profile-info-label" style={{fontWeight: 500, fontSize: 14, cursor: 'pointer', color: '#666'}} 
                       onClick={() => window.open('/privacy', '_blank')}>
                    Política de privacidad
                  </div>
                </div>
                <div className="profile-settings-row" style={{marginBottom: 12}}>
                  <div className="profile-info-label" style={{fontWeight: 500, fontSize: 14, cursor: 'pointer', color: '#666'}}
                       onClick={() => window.open('/terms', '_blank')}>
                    Términos y condiciones
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card derecha: configuraciones y acciones */}
          <div className="profile-card right" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px #eab5c555', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 520, minHeight: 420}}>
            <div className="profile-settings-box">
              {renderField('language', 'Idioma', localUser.language)}
              {renderField('currency', 'Moneda', localUser.currency)}
              
              {/* Sección de dirección */}
              <div style={{marginBottom: 20, paddingTop: 10, borderTop: '1px solid #f0f0f0'}}>
                <h4 style={{fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 15}}>Información de Dirección</h4>
                {renderField('street', 'Calle y número', localUser.street)}
                {renderField('city', 'Ciudad', localUser.city)}
                {renderField('department', 'Departamento', localUser.department)}
                {renderField('zipCode', 'Código postal', localUser.zipCode)}
                {renderField('country', 'País', localUser.country)}
                
                {/* Botón para copiar dirección */}
                <button 
                  onClick={copyAddressToClipboard}
                  style={{
                    background: '#F0EFFA',
                    color: '#222',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    marginTop: 10,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CopyIcon size={14} color="#222" />
                  Copiar dirección completa
                </button>
              </div>
              
              {/* Botón de historial de pedidos */}
              <div className="profile-settings-row" style={{marginBottom: 12}}>
                <button 
                  className="order-history-btn" 
                  style={{
                    background: '#F0EFFA', 
                    color: '#222', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '8px 16px', 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#eab5c5';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#F0EFFA';
                    e.target.style.color = '#222';
                  }}
                  onClick={() => window.location.href = '/historial'}
                >
                  <HistoryIcon size={16} color="currentColor" />
                  Historial de pedidos
                </button>
              </div>

    
              {/* Botón de historial de reseñas */}
              <div className="profile-settings-row" style={{marginBottom: 12}}>
                <button 
                  className="order-history-btn" 
                  style={{
                    background: '#F0EFFA', 
                    color: '#222', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '8px 16px', 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#eab5c5';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#F0EFFA';
                    e.target.style.color = '#222';
                  }}
                  onClick={() => window.location.href = '/histReview'}
                >
                  <HistoryIcon size={16} color="currentColor" />
                  Historial de reseñas
                </button>
              </div>


              
              
              {/* Botón para cerrar sesión */}
              <div className="profile-settings-row" style={{marginBottom: 12}}>
                <button 
                  className="logout-btn" 
                  style={{background: 'none', color: '#e75480', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer'}} 
                  onClick={handleLogout}
                >
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