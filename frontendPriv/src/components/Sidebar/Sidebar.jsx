import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  FaBox, FaTruck, FaPlusCircle, FaShoppingCart,
  FaTags, FaUsers, FaCog,
  FaCompass, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`sidebar-wrapper ${isMenuOpen ? 'open' : ''}`}>
      {/* Botón de hamburguesa visible en pantallas pequeñas */}
      <button className="hamburger-button" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar principal */}
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
          <NavLink to="/productos" className="nav-link">
            <FaBox className="icon" /> <span>Productos</span>
          </NavLink>
          <NavLink to="/agregar-producto" className="nav-link">
            <FaPlusCircle className="icon" /> <span>Agregar productos</span>
          </NavLink>
          <NavLink to="/historial-compras" className="nav-link">
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
          <NavLink to="/cerrarsesion" className="nav-link">
            <FaSignOutAlt className="icon" /> <span>Cerrar sesión</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
