// Importaciones necesarias para el componente de navegación
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';
import { Menu, X, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Importar el hook de tu contexto
import CleanLogo from './CleanLogo';
import ProductsMenu from './ProductsMenu';

// Componente del icono de carrito personalizado más compacto
const CartIcon = ({ size = 24 }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ minWidth: size, minHeight: size }}
    >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

// Componente principal de navegación
const Nav = ({ cartOpen = false }) => {
    // Estados para controlar el comportamiento de la navegación
    const [isOpen, setIsOpen] = useState(false);
    const { cartItems } = useCart();
    const { user, isAuthenticated, loading } = useAuth();
    const [bump, setBump] = useState(false);
    const prevCount = useRef(0);
    
    // Debug: Log del estado de autenticación (comentado para producción)
    // console.log('🔍 Nav Debug:', { user, isAuthenticated, loading });
    
    // Calcular el total de items en el carrito
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    // Estados para detectar diferentes tamaños de pantalla
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);
    const [isTinyMobile, setIsTinyMobile] = useState(window.innerWidth <= 320);
    
    // Referencias para elementos del DOM
    const menuRef = useRef(null);
    const toggleRef = useRef(null);
    const location = useLocation();

    // Efecto: Cerrar menús al cambiar de página
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Efecto: Detectar si es un dispositivo móvil y manejar cambios de tamaño
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 1000;
            const newIsSmallMobile = window.innerWidth <= 480;
            const newIsTinyMobile = window.innerWidth <= 320;
            
            setIsMobile(newIsMobile);
            setIsSmallMobile(newIsSmallMobile);
            setIsTinyMobile(newIsTinyMobile);
            
            if (!newIsMobile) {
                setIsOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Efecto: Manejo de clics fuera del menú para cerrarlo
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!menuRef.current || !toggleRef.current) return;
            
            if (isOpen && 
                !menuRef.current.contains(e.target) && 
                !toggleRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Efecto: Animación de rebote cuando cambia el número de items en el carrito
    useEffect(() => {
        if (totalCount !== prevCount.current) {
            setBump(true);
            prevCount.current = totalCount;
            const timer = setTimeout(() => setBump(false), 400);
            return () => clearTimeout(timer);
        }
    }, [totalCount]);

    // Función para alternar el estado del menú móvil
    const toggleMenu = (e) => {
        if (e) e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <>
            <header 
                className={isOpen && !isMobile ? 'header header--menu-open' : 'header'}
                style={{
                    width: '100%',
                    position: 'fixed',
                    top: isMobile ? '0' : '32px',
                    left: 0,
                    zIndex: cartOpen ? 9998 : 100,
                    background: isMobile ? 'transparent' : undefined,
                    boxShadow: isMobile ? 'none' : 'none',
                    height: isMobile ? '60px' : 'auto',
                    display: isMobile ? 'flex' : 'block',
                    alignItems: isMobile ? 'center' : 'normal'
                }}
            >
                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: isMobile ? '100%' : 'calc(70px + 1rem)',
                        maxWidth: '1300px',
                        margin: '0 auto',
                        padding: isTinyMobile ? '0 0.05rem' : isSmallMobile ? '0 0.1rem' : isMobile ? '0 clamp(0.15rem, 1vw, 0.4rem)' : '0 clamp(0.3rem, 2vw, 0.8rem)',
                        width: '100%'
                    }}
                >
                    <CleanLogo isMobile={isMobile} isSmallMobile={isSmallMobile} />
                    
                <div 
                    ref={menuRef} 
                    className={`nav-menu ${isOpen ? 'show-menu' : ''} ${cartOpen ? 'nav-menu--cart-open' : ''}`}
                >
                    {isMobile && (
                        <div className="nav-menu-header">
                            <button className="nav-close-btn" onClick={toggleMenu}>
                                <X size={24} />
                            </button>
                        </div>
                    )}
                    
                    <ul className="nav-list">
                            <ProductsMenu 
                                isMobile={isMobile} 
                                toggleMenu={toggleMenu} 
                                location={location} 
                            />
                        <li><Link to="/sobre-nosotros" className={`nav-link${location.pathname.startsWith('/sobre-nosotros') ? ' active' : ''}`} onClick={toggleMenu}><span className="nav-link-inner">Sobre Nosotros</span></Link></li>
                        <li><Link to="/contactanos" className={`nav-link${location.pathname.startsWith('/contactanos') ? ' active' : ''}`} onClick={toggleMenu}><span className="nav-link-inner">Contáctanos</span></Link></li>
                    </ul>
                </div>

                <div className="nav-actions">
                    <div 
                        ref={toggleRef}
                        className="nav-toggle" 
                        onClick={toggleMenu}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </div>
                    
                    {/* Renderizado condicional: El botón de Iniciar Sesión solo aparece si NO hay usuario */}
                    {!user && !isAuthenticated && (
                        <Link to="/login" className="nav-login-btn">
                            Iniciar Sesión
                        </Link>
                    )}
                    
                    {/* El icono del perfil se muestra solo para usuarios autenticados */}
                    {(user || isAuthenticated) && (
                        <Link to="/perfil" className="nav-icon nav-icon-user" aria-label="Perfil">
                            <User size={22} />
                        </Link>
                    )}
                    
                    <Link to="/carrito" className="nav-icon nav-cart-icon" aria-label="Carrito de Compras">
                        <CartIcon size={22} />
                        {totalCount > 0 && (
                            <span className={`nav-cart-badge${bump ? ' bump' : ''}`}>{totalCount}</span>
                        )}
                    </Link>
                </div>
                </div>
            </header>
            
            {/* {isOpen && isMobile && <div className="nav-overlay" onClick={() => setIsOpen(false)}></div>} */}
        </>
    );
};

export default Nav;