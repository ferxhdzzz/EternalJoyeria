import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './TopBar.css';

const TopBar = ({ userName = "Yu Jimin", userImage = "/karinaaaaaa.jpg" }) => {
  return (
    <div className="topbar">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Buscar..." />
      </div>

      <div className="topbar-right">
        <div className="icon-button">
          <FaBell />
        </div>
        <NavLink to="/ajustes" className="profile">
          <img src={userImage} alt="Profile" className="profile-img" />
          <span>{userName}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default TopBar;
