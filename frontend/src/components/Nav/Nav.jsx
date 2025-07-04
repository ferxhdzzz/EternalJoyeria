import React, { useState } from 'react'; // Imports React and the useState hook for managing component state.
import { NavLink } from 'react-router-dom'; // Imports NavLink for navigation, which can style active links.
import { ShoppingBag, User, Menu, X } from 'lucide-react'; // Imports specific icons from the lucide-react library.
import './Nav.css'; // Imports the stylesheet for the Nav component.

// Defines the Nav functional component.
const Nav = () => {
  // Initializes state for tracking whether the mobile menu is open or closed.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Defines a function to toggle the state of the mobile menu.
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // The return statement contains the JSX that will be rendered.
  return (
  // The main navigation bar element.
  <nav className="nav">
    {/* Container for the website logo. */}
    <div className="nav__logo">
      {/* The logo image. */}

       <NavLink to="/" >
      <img src="/EternalLogo.png" alt="Eternal Logo" />


       </NavLink>
    </div>
    {/* Container for all content on the right side of the navbar. */}
    <div className="nav__right-content">
      {/* Unordered list for navigation links. Class is dynamic based on mobile menu state. */}
      <ul className={`nav__links ${isMobileMenuOpen ? 'nav__links--open' : ''}`}>
        {/* List item for the 'Inicio' link. */}
        <li>
          {/* NavLink to the home page. The class is set dynamically based on whether the link is active. */}
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
            Inicio
          </NavLink>
        </li>
        {/* List item for the 'Sobre nosotros' link. */}
        <li>
          {/* NavLink to the 'About Us' page with dynamic active styling. */}
          <NavLink to="/sobre-nosotros" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
            Sobre nosotros
          </NavLink>
        </li>
        {/* List item for the 'Productos' link. */}
        <li>
          {/* NavLink to the 'Products' page. Also closes the mobile menu on click. */}
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'} onClick={() => isMobileMenuOpen && toggleMobileMenu()}>
            Productos
          </NavLink>
        </li>
      </ul>
        {/* Container for the action icons (shopping bag, user profile). */}
        <div className="nav__icons">
          {/* Link to the shopping cart page. */}
          <NavLink to="/shop" className="nav__icon-link">
            {/* Shopping bag icon. */}
            <ShoppingBag className="nav__icon" />
          </NavLink>
          {/* Link to the user profile page. */}
          <NavLink to="/profile">
            {/* User profile icon. */}
            <User className="nav__icon" />
          </NavLink>
        </div>
      {/* Container for the mobile menu toggle icon (hamburger/X). */}
      <div className="nav__mobile-menu-icon" onClick={toggleMobileMenu}>
        {/* Conditionally renders the 'X' icon if the menu is open, or the 'Menu' icon if it's closed. */}
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </div>
  </nav>
);
}

// Exports the Nav component for use in other parts of the application.
export default Nav;
