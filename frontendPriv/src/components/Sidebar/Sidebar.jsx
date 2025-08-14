import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import Swal from 'sweetalert2';
import {
  FaBox, FaTruck, FaPlusCircle, FaShoppingCart,
  FaTags, FaUsers, FaCog,
  FaCompass, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';
import useDataLogout from '../../hooks/Logout/useDataLogout';

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigate = useNavigate();
  const { logoutUser } = useDataLogout(navigate);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión se cerrará',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      logoutUser();
    }
  };

  return (
    <div className={`sidebar-wrapper ${isMenuOpen ? 'open' : ''}`}>
      <button className="hamburger-button" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="sidebarr">
        <div className="logop">
          <NavLink to="/">
            <img src="/EternalLogo.png" alt="Logo" />
          </NavLink>
          <span>| Administrador</span>
        </div>

        <nav className="menuu">
          <NavLink to="/dashboard" className="nav-link">
            <FaCompass className="icon" /> <span>Menu</span>
          </NavLink>
          <NavLink to="/productPriv" className="nav-link">
            <FaBox className="icon" /> <span>Productos</span>
          </NavLink>
          <NavLink to="/AddProduct" className="nav-link">
            <FaPlusCircle className="icon" /> <span>Agregar productos</span>
          </NavLink>
          <NavLink to="/HistorialCompras" className="nav-link">
            <FaTruck className="icon" /> <span>Compras</span>
          </NavLink>
          <NavLink to="/resenas" className="nav-link">
            <FaUsers className="icon" /> <span>Reseñas</span>
          </NavLink>
          <NavLink to="/categorias" className="nav-link">
            <FaTags className="icon" /> <span>Categorías</span>
          </NavLink>
          <NavLink to="/ajustes" className="nav-link">
            <FaCog className="icon" /> <span>Ajustes</span>
          </NavLink>
        </nav>

        <div className="settings">
     <button className="nav-link" onClick={handleLogout}>
  <FaSignOutAlt className="icon" /> <span>Cerrar sesión</span>
</button>

        </div>
      </div>
    </div>
  );
}

export default Sidebar;
