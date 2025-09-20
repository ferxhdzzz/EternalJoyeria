import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import Nav from '../components/Nav/Nav';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import '../styles/ProfileRedesign.css';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { LockIcon, HistoryIcon, CheckIcon, XIcon } from '../components/Icons';

const Profile = () => {
  const { logout } = useAuth();

  // Hook de perfil (usuario autenticado)
  const { user, loading, error, updateProfile, updateProfilePicture } = useProfile();

  // Estado UI
  const [profileImage, setProfileImage] = useState('/Perfil/foto-perfil.png');
  const [cartOpen, setCartOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [message, setMessage] = useState('');
  const [localUser, setLocalUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '****',
    street: '',
    city: '',
    department: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setLocalUser(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || '',
      }));

      if (user.profilePicture) {
        setProfileImage(user.profilePicture);
      } else {
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

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);

      const result = await updateProfilePicture(file);
      if (result.success) {
        showMessage('Foto de perfil actualizada correctamente! 🎉');
        if (result.data && result.data.profilePicture) {
          setProfileImage(result.data.profilePicture);
        }
      } else {
        showMessage('Error al actualizar la foto: ' + result.error);
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
        const result = await updateProfile(updateData);
        if (result.success) {
          if (field === 'name') {
            setLocalUser(prev => ({
              ...prev,
              firstName: updateData.firstName,
              lastName: updateData.lastName
            }));
          } else {
            setLocalUser(prev => ({ ...prev, [field]: tempValue }));
          }
          showMessage('Perfil actualizado correctamente!');
        } else {
          showMessage('Error al actualizar: ' + result.error);
          return;
        }
      }
      setEditingField(null);
      setTempValue('');
    } catch (err) {
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
      setTimeout(() => {
        window.location.href = "/productos";
      }, 1500);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo cerrar sesión. Intenta de nuevo.",
        icon: "error"
      });
    }
  };

  const renderField = (field, label, value, isPassword = false) => {
    if (isPassword) {
      return (
        <div className="profile-info-row">
          <div className="profile-info-label">{label}</div>
          <button
            className="edit-btn"
            onClick={() => window.location.href = '/recuperacion'}
          >
            <LockIcon size={14} color="white" /> Cambiar contraseña
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
          <div className="edit-actions">
            <button className="edit-btn save" onClick={() => handleSaveEdit(field)}>
              <CheckIcon size={12} color="white" />
            </button>
            <button className="edit-btn cancel" onClick={handleCancelEdit}>
              <XIcon size={12} color="white" />
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => handleEditClick(field)}>Editar</button>
        )}
      </div>
    );
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Nav cartOpen={cartOpen} />
      {message && <div className="toast">{message}</div>}

      <div className="profile-page">
        <div className="profile-redesign-container">
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
              {renderField('phone', 'Tu teléfono', localUser.phone)}
              {renderField('password', 'Tu contraseña', '••••••••', true)}

              <div className="profile-actions">
                <button
                  className="order-history-btn"
                  onClick={() => window.location.href = '/historial'}
                >
                  <HistoryIcon size={16} /> Historial de pedidos
                </button>

                <button
                  className="order-history-btn"
                  onClick={() => window.location.href = '/histReview'}
                >
                  <HistoryIcon size={16} /> Historial de reseñas
                </button>

                <button
                  className="logout-btn"
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
