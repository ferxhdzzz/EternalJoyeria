import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav/Nav';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfilePhotoSection from '../components/Profile/ProfilePhotoSection';
import SidebarCart from '../components/Cart/SidebarCart';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import '../styles/ProfileRedesign.css';

// Página de perfil de usuario
const Profile = () => {
  // Estado para notificaciones
  const [notifications, setNotifications] = useState(true);
  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  // Estado para mostrar/ocultar el carrito
  const [cartOpen, setCartOpen] = useState(false);
  // Estado para mostrar pantalla de carga
  const [isLoading, setIsLoading] = useState(true);
  // Estado para saber qué campo se está editando
  const [editingField, setEditingField] = useState(null);
  // Estado temporal para el valor editado
  const [tempValue, setTempValue] = useState('');

  // Datos de usuario (simulados)
  const [user, setUser] = useState({
    name: 'Jennifer Teos',
    email: 't22jenn@gmail.com',
    phone: '+503 7104--2228',
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

  // Simula la carga inicial (pantalla de loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Cambia la foto de perfil y muestra un pequeño efecto
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        // Efecto visual al actualizar la foto
        const btn = e.target.parentElement;
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Inicia la edición de un campo
  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(user[field]);
  };

  // Guarda el valor editado
  const handleSaveEdit = (field) => {
    setUser(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
    setTempValue('');
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
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres desconectarte?')) {
      window.location.href = '/login';
    }
  };

  // Función para copiar la dirección completa al portapapeles
  const copyAddressToClipboard = () => {
    const fullAddress = `${user.street}, ${user.city}, ${user.department}, ${user.zipCode}, ${user.country}`;
    navigator.clipboard.writeText(fullAddress).then(() => {
      // Mostrar notificación temporal
      const notification = document.createElement('div');
      notification.textContent = 'Dirección copiada al portapapeles';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
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

  // Muestra pantalla de carga mientras isLoading es true
  if (isLoading) {
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

  // Render principal de la página de perfil
  return (
    <div>
      <Nav cartOpen={cartOpen} />
             <div className="profile-page" style={{minHeight: '100vh', background: '#fff', marginTop: '180px'}}>
        {/* Barra rosa superior */}
        {/* <div className="profile-bg-bar" style={{height: '80px', width: '1100px', maxWidth: '95vw', margin: '2rem auto 0 auto', background: '#eab5c5', borderRadius: '20px'}}></div> */}
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
               {renderField('name', 'Tu nombre', user.name)}
               {renderField('email', 'Tu correo', user.email)}
               {renderField('phone', 'Tu telefono', user.phone)}
               {renderField('password', 'Tu contraseña', user.password, true)}
               
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
              {renderField('language', 'Idioma', user.language)}
              {renderField('currency', 'Moneda', user.currency)}
              
                             {/* Sección de dirección */}
               <div style={{marginBottom: 20, paddingTop: 10, borderTop: '1px solid #f0f0f0'}}>
                 <h4 style={{fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 15}}>Información de Dirección</h4>
                {renderField('street', 'Calle y número', user.street)}
                {renderField('city', 'Ciudad', user.city)}
                {renderField('department', 'Departamento', user.department)}
                {renderField('zipCode', 'Código postal', user.zipCode)}
                {renderField('country', 'País', user.country)}
                
                
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