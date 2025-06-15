import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import './Nav.css';

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
  <nav className="nav">
    <div className="nav__logo">

       <NavLink to="/" >
      <img src="/EternalLogo.png" alt="Eternal Logo" />


       </NavLink>
    </div>
    <div className="nav__right-content">
      <ul className={`nav__links ${isMobileMenuOpen ? 'nav__links--open' : ''}`}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
            Inicio
          </NavLink>
        </li>
        <li>
                    <NavLink to="/sobre-nosotros" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
            Sobre nosotros
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'} onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
            Productos
          </NavLink>
        </li>
      </ul>
        <div className="nav__icons">
          <NavLink to="/shop" className="nav__icon-link">
            <ShoppingBag className="nav__icon" />
          </NavLink>
          <NavLink to="/profile">
            <User className="nav__icon" />
          </NavLink>
        </div>
      <div className="nav__mobile-menu-icon" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </div>
  </nav>
);
}

export default Nav;
