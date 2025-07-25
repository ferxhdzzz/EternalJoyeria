import React, { useState } from 'react';
import { FaSearch, FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import usePerfilAdmin from "../../hooks/Ajustes/useFetchAjustes";
import './TopBar.css';

const TopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { admin, loading } = usePerfilAdmin();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="topbar">
      <div className="topbar-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="icon-button">
          <FaBell />
        </div>

        <NavLink to="/ajustes" className="profile">
          <img
            src={admin?.profilePicture || "/default-profile.jpg"}
            alt="Profile"
            className="profile-img"
          />
          <span>{admin?.name || "Cargando..."}</span>
        </NavLink>
      </div>

      <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="search-box mobile-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar..." />
          </div>

          <div className="icon-button mobile-bell">
            <FaBell />
          </div>

          <NavLink to="/ajustes" className="profile mobile-profile" onClick={() => setMenuOpen(false)}>
            <img
              src={admin?.profilePicture || "/default-profile.jpg"}
              alt="Profile"
              className="profile-img"
            />
            <span>{admin?.name || "Cargando..."}</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default TopBar;
