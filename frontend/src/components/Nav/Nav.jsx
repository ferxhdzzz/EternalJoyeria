// src/components/Nav/Nav.jsx
import React, { useState, useEffect, useRef } from "react";
// 🔑 Importamos useNavigate
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Nav.css";
import { Menu, X, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CleanLogo from "./CleanLogo";
import ProductsMenu from "./ProductsMenu";
import { useCountry } from "../../context/CountryContext";

// Estilos base para los botones de país
const countryBtnBaseStyle = {
  padding: '0.3rem 0.6rem',
  borderRadius: '8px',
  border: '1px solid transparent',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: '600',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  color: '#333',
};

// Función que aplica el estilo a un botón de país
const getCountryBtnStyle = (isActive, isDefault) => {
  const isVisuallyActive = isActive || (isDefault && isActive);

  return {
    ...countryBtnBaseStyle,
    backgroundColor: isVisuallyActive ? '#d95f7a' : 'white',
    color: isVisuallyActive ? 'white' : '#333',
    borderColor: isVisuallyActive ? '#d95f7a' : '#ccc',
    boxShadow: isVisuallyActive ? '0 2px 5px rgba(217, 95, 122, 0.4)' : 'none',
  };
};

// Icono de carrito
const CartIcon = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: size, minHeight: size }}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Nav = ({ cartOpen = false }) => {
  const { cartItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { country, chooseCountry } = useCountry();
  // 🔑 Inicializamos useNavigate
  const navigate = useNavigate(); 

  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);
  const [isTinyMobile, setIsTinyMobile] = useState(window.innerWidth <= 320);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const location = useLocation();

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 1000;
      setIsMobile(newIsMobile);
      setIsSmallMobile(window.innerWidth <= 480);
      setIsTinyMobile(window.innerWidth <= 320);
      if (!newIsMobile) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current || !toggleRef.current) return;
      if (isOpen && !menuRef.current.contains(e.target) && !toggleRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (totalCount !== prevCount.current) {
      setBump(true);
      prevCount.current = totalCount;
      const timer = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalCount]);

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleCountryChange = (newCountry) => {
    // 1. Cambiar el país en el contexto
    chooseCountry(newCountry);
    
    // 2. 🔑 Redirigir a la página principal de productos
    navigate("/productos"); 
  };

  const noCountrySelected = !country || (country !== "US" && country !== "SV");

  return (
    <header className={isOpen && !isMobile ? "header header--menu-open" : "header"} style={{ width: "100%", position: "fixed", top: isMobile ? "0" : "32px", left: 0, zIndex: cartOpen ? 9998 : 100, background: isMobile ? "transparent" : undefined, boxShadow: "none", height: isMobile ? "60px" : "auto", display: isMobile ? "flex" : "block", alignItems: isMobile ? "center" : "normal" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: isMobile ? "100%" : "calc(70px + 1rem)", maxWidth: "1300px", margin: "0 auto", padding: isTinyMobile ? "0 0.05rem" : isSmallMobile ? "0 0.1rem" : isMobile ? "0 clamp(0.15rem, 1vw, 0.4rem)" : "0 clamp(0.3rem, 2vw, 0.8rem)", width: "100%" }}>
        <CleanLogo isMobile={isMobile} isSmallMobile={isSmallMobile} />

        <div ref={menuRef} className={`nav-menu ${isOpen ? "show-menu" : ""} ${cartOpen ? "nav-menu--cart-open" : ""}`}>
          {isMobile && (
            <div className="nav-menu-header">
              <button className="nav-close-btn" onClick={toggleMenu}>
                <X size={24} />
              </button>
            </div>
          )}

          <ul className="nav-list">
            <ProductsMenu isMobile={isMobile} toggleMenu={toggleMenu} location={location} />
            <li><Link to="/sobre-nosotros" className={`nav-link${location.pathname.startsWith("/sobre-nosotros") ? " active" : ""}`} onClick={toggleMenu}><span className="nav-link-inner">Sobre Nosotros</span></Link></li>
            <li><Link to="/contactanos" className={`nav-link${location.pathname.startsWith("/contactanos") ? " active" : ""}`} onClick={toggleMenu}><span className="nav-link-inner">Contáctanos</span></Link></li>
          </ul>
        </div>

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* 🔑 Implementación de handleCountryChange */}
          <button 
            onClick={() => handleCountryChange("SV")} 
            style={getCountryBtnStyle(country === "SV", noCountrySelected)}
            aria-label="Seleccionar El Salvador"
          >
            {noCountrySelected ? "Seleccionar País" : "SV"} 
          </button>

          <button 
            onClick={() => handleCountryChange("US")} 
            style={getCountryBtnStyle(country === "US", false)}
            aria-label="Seleccionar USA"
          >
            USA
          </button>

          <div ref={toggleRef} className="nav-toggle" onClick={toggleMenu} style={{ cursor: "pointer" }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>

          {!user && !isAuthenticated && (
            <Link to="/login" className="nav-login-btn">Iniciar Sesión</Link>
          )}

          {(user || isAuthenticated) && (
            <Link to="/perfil" className="nav-icon nav-icon-user" aria-label="Perfil"><User size={22} /></Link>
          )}
<br /><br /><br />
          <Link to="/carrito" className="nav-icon nav-cart-icon" aria-label="Carrito de Compras" style={{ position: "relative" }}>

            <CartIcon size={22} />
            {totalCount > 0 && <span className={`nav-cart-badge${bump ? " bump" : ""}`}>{totalCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;