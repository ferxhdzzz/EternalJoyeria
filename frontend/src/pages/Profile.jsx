import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav/Nav';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfilePhotoSection from '../components/Profile/ProfilePhotoSection';
import SidebarCart from '../components/Cart/SidebarCart';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import '../styles/ProfileRedesign.css';

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // Dummy data for demonstration
  const [user, setUser] = useState({
    name: 'Jennifer Teos',
    email: 't22jenn@gmail.com',
    phone: '+503 7104--2228',
    password: '**********',
    language: 'Español',
    currency: 'USD',
    location: 'SV',
  });

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        // Efecto de éxito
        const btn = e.target.parentElement;
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValue(user[field]);
  };

  const handleSaveEdit = (field) => {
    setUser(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
    setTempValue('');
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

  const handleLogout = () => {
    // Efecto de confirmación antes de logout
    if (window.confirm('¿Estás seguro de que quieres desconectarte?')) {
      window.location.href = '/login';
    }
  };

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

  return (
    <div>
      <Nav cartOpen={cartOpen} />
      <div className="profile-page" style={{minHeight: '100vh', background: '#fff', marginTop: '180px'}}>
        <div className="profile-bg-bar" style={{height: '80px', width: '1100px', maxWidth: '95vw', margin: '2rem auto 0 auto', background: '#eab5c5', borderRadius: '20px'}}></div>
        <div className="profile-redesign-container" style={{display: 'flex', gap: '2.5rem', justifyContent: 'center', alignItems: 'flex-start', marginTop: '-40px'}}>
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
            </div>
          </div>
          <div className="profile-card right" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px #eab5c555', padding: '2.5rem 2rem', minWidth: 420, maxWidth: 520, minHeight: 420}}>
            <div className="profile-settings-box">
              {renderField('language', 'Idioma', user.language)}
              {renderField('currency', 'Moneda', user.currency)}
              {renderField('location', 'Ubicacion', user.location)}
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
              <div className="profile-settings-row" style={{marginBottom: 12}}>
                <div className="profile-info-label" style={{fontWeight: 500, fontSize: 14, cursor: 'pointer'}} 
                     onClick={() => window.open('/privacy', '_blank')}>
                  Política de privacidad
                </div>
              </div>
              <div className="profile-settings-row" style={{marginBottom: 12}}>
                <div className="profile-info-label" style={{fontWeight: 500, fontSize: 14, cursor: 'pointer'}}
                     onClick={() => window.open('/terms', '_blank')}>
                  Términos y condiciones
                </div>
              </div>
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