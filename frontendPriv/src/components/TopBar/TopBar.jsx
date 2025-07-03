import React, { useState } from 'react';
import { FaSearch, FaBell, FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './TopBar.css';

const TopBar = ({ userName = "Yu Jimin", userImage = "/karinaaaaaa.jpg" }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="topbar">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Buscar..." />
      </div>

      {/* Contenido normal para pantallas grandes */}
      <div className="topbar-right">
        <div className="icon-button">
          <FaBell />
        </div>
        <NavLink to="/ajustes" className="profile">
          <img src={userImage} alt="Profile" className="profile-img" />
          <span>{userName}</span>
        </NavLink>
      </div>

      {/* Botón hamburguesa para pantallas pequeñas */}
     <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
  {menuOpen ? <FaChevronUp /> : <FaChevronDown />}
</button>
      {/* Menú desplegable para móviles */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="icon-button mobile-bell">
            <FaBell />
          </div>
          <NavLink to="/ajustes" className="profile mobile-profile" onClick={() => setMenuOpen(false)}>
            <img src={userImage} alt="Profile" className="profile-img" />
            <span>{userName}</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default TopBar;
