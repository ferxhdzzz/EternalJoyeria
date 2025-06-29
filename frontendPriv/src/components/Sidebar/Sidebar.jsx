import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import {
  FaBox, FaTruck, FaPlusCircle, FaShoppingCart,
  FaTags, FaUsers, FaCog,
  FaCompass
} from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logop">
       <NavLink to="/">
          <img src="/EternalLogo.png" alt="Logo" />
        </NavLink>
      </div>

      <nav className="menu">
      <NavLink to="/Dashboard" className="nav-link">
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
          <FaShoppingCart className="icon" /> <span>Reseñas</span>
        </NavLink>
        <NavLink to="/categorias" className="nav-link">
          <FaTags className="icon" /> <span>Categorías</span>
        </NavLink>
        <NavLink to="/empleados" className="nav-link">
          <FaUsers className="icon" /> <span>Descuentos</span>
        </NavLink>
        

        
      </nav>

      <div className="settings">
        <NavLink to="/ajustes" className="nav-link">
          <FaCog className="icon" /> <span>Ajustes</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;