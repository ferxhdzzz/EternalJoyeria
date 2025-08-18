import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav/Nav';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfilePhotoSection from '../components/Profile/ProfilePhotoSection';
import SidebarCart from '../components/Cart/SidebarCart';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import '../styles/ProfileRedesign.css';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';

// Página de perfil de usuario
const Profile = () => {
  const { logout } = useAuth();
  
  // Usar nuestro hook personalizado (sin parámetros - obtiene usuario autenticado)
  const { user, loading, error, updateProfile, updateProfilePicture } = useProfile();
  
  // Estado para notificaciones
  const [notifications, setNotifications] = useState(true);
  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  // Estado para mostrar/ocultar el carrito
  const [cartOpen, setCartOpen] = useState(false);
  // Estado para saber qué campo se está editando
  const [editingField, setEditingField] = useState(null);
  // Estado temporal para el valor editado
  const [tempValue, setTempValue] = useState('');
  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState('');

  // Datos de usuario por defecto (se sobrescribirán con los datos del backend)
  const [localUser, setLocalUser] = useState({
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'usuario@ejemplo.com',
    phone: '+34123456789',
    password: '**********',
    language: 'Español',
    currency: 'USD',
    // Campos de dirección expandidos
    street: 'Calle Principal #123',
    city: 'San Salvador',
    department: 'San Salvador',
    zipCode: '1101',
    country: 'El Salvador',
  });

  // Actualizar el usuario local cuando lleguen los datos del backend
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
      
      // Actualizar la imagen de perfil
      if (user.profilePicture) {
        console.log('📸 Foto de perfil encontrada en backend:', user.profilePicture);
        setProfileImage(user.profilePicture);
      } else {
        console.log('📸 No hay foto de perfil en backend, usando imagen por defecto');
        setProfileImage('/Perfil/foto-perfil.png');
      }
    }
  }, [user]);

  // Mostrar mensajes temporales
  const showMessage = (text, isError = false) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  // Cambia la foto de perfil y la sube al backend
  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('📸 Archivo seleccionado:', file.name, file.size);
      
      // Mostrar la imagen inmediatamente para mejor UX
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
        
        // Actualizar la imagen con la URL del backend
        if (result.data && result.data.profilePicture) {
          console.log('🔄 Actualizando imagen con URL del backend:', result.data.profilePicture);
          setProfileImage(result.data.profilePicture);
        }
      } else {
        console.error('❌ Error al subir foto:', result.error);
        showMessage('Error al actualizar la foto: ' + result.error, true);
        
        // Revertir a la imagen anterior
        if (user && user.profilePicture) {
          setProfileImage(user.profilePicture);
        } else {
          setProfileImage('/Perfil/foto-perfil.png');
        }
      }
    }
  };

  // Inicia la edición de un campo
  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(localUser[field]);
  };

  // Guarda el valor editado
  const handleSaveEdit = async (field) => {
    try {
      // Preparar los datos para enviar al backend
      let updateData = {};
      
      if (field === 'name') {
        // Si es el nombre, dividirlo en firstName y lastName
        const nameParts = tempValue.split(' ');
        updateData.firstName = nameParts[0] || '';
        updateData.lastName = nameParts.slice(1).join(' ') || '';
      } else if (field === 'phone') {
        updateData.phone = tempValue;
      } else if (field === 'email') {
        updateData.email = tempValue;
      }

      // Solo actualizar si hay datos para enviar
      if (Object.keys(updateData).length > 0) {
        console.log('📝 Enviando actualización al backend:', updateData);
        const result = await updateProfile(updateData);
        if (result.success) {
          setLocalUser(prev => ({
            ...prev,
            [field]: tempValue
          }));
          showMessage('Perfil actualizado correctamente! ✨');
        } else {
          showMessage('Error al actualizar: ' + result.error, true);
          return; // No cerrar la edición si hay error
        }
      }

      setEditingField(null);
      setTempValue('');
    } catch (error) {
      console.error('❌ Error al actualizar el perfil:', error);
      showMessage('Error al actualizar el perfil', true);
    }
  };

  // Cancela la edición
  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  // Permite guardar/cancelar con Enter/Escape
  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      handleSaveEdit(field);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Cierra sesión con confirmación
  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres desconectarte?')) {
      try {
        await logout();
        // Redirigir a la página de login
        window.location.href = '/login';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Si falla el logout del backend, redirigir de todas formas
        window.location.href = '/login';
      }
    }
  };

  // Función para copiar la dirección completa al portapapeles
  const copyAddressToClipboard = () => {
    const fullAddress = `${localUser.street}, ${localUser.city}, ${localUser.department}, ${localUser.zipCode}, ${localUser.country}`;
    navigator.clipboard.writeText(fullAddress).then(() => {
      showMessage('Dirección copiada al portapapeles 📋');
    });
  };

  // Renderiza un campo editable del perfil
  const renderField = (field, label, value, isPassword = false) => {
    const isEditing = editingField === field;
    
    return (
      <div className="profile-info-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
        <div>
          <div className="profile-info-label" style={{fontWeight: 500, fontSize: 14}}>{label}</div>
          {isEditing ? (
            <input
              type={isPassword ? "password" : "text"}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, field)}
              style={{
                border: '2px solid #F0EFFA',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '15px',
                fontWeight: '600',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              autoFocus
            />
          ) : (
            <div className="profile-info-value" style={{fontWeight: 700, fontSize: 15}}>
              {isPassword ? '•'.repeat(8) : value}
            </div>
          )}
        </div>
        {isEditing ? (
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              className="edit-btn" 
              style={{background: '#4CAF50', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer'}}
              onClick={() => handleSaveEdit(field)}
            >
              ✓
            </button>
            <button 
              className="edit-btn" 
              style={{background: '#f44336', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer'}}
              onClick={handleCancelEdit}
            >
              ✕
            </button>
          </div>
        ) : (
          <button 
            className="edit-btn" 
            style={{background: '#F0EFFA', color: '#222', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer'}}
            onClick={() => handleEditClick(field)}
          >
            Editar
          </button>
        )}
      </div>
    );
  };

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
  if (error) {
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
        <h2>Error al cargar el perfil 😔</h2>
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
              {renderField('password', 'Tu contraseña', localUser.password, true)}
              
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
                    width: '100%'
                  }}
                >
                  📋 Copiar dirección completa
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
                    transition: 'all 0.3s ease'
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
                  Historial de pedidos
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