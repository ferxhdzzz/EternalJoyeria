import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';
import { Menu, X, ChevronDown, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Nav = ({ cartOpen = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const { cartItems } = useCart();
    const [bump, setBump] = useState(false);
    const prevCount = useRef(0);
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
    const menuRef = useRef(null);
    const toggleRef = useRef(null);
    const location = useLocation();

    // Cerrar menús al cambiar de página
    useEffect(() => {
        setIsOpen(false);
        setCategoryOpen(false);
    }, [location.pathname]);

    // Detectar si es un dispositivo móvil
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 1000;
            setIsMobile(newIsMobile);
            if (!newIsMobile) {
                setIsOpen(false);
                setCategoryOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Llamada inicial para establecer el estado correcto
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Mejorado: manejo de clics fuera del menú
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!menuRef.current || !toggleRef.current) return;
            
            if (isOpen && 
                !menuRef.current.contains(e.target) && 
                !toggleRef.current.contains(e.target)) {
                setIsOpen(false);
                setCategoryOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
        if (!isOpen) {
            setCategoryOpen(false);
        }
    };
    
    const toggleCategory = (e) => {
        if (e) e.stopPropagation();
        setCategoryOpen(!categoryOpen);
    };

    return (
        <header className={`header ${cartOpen ? 'header--cart-open' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src="/Products/EternalLogo.png" alt="Eternal Joyeria Logo" className="logo-image" />
                </Link>

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
                        <li><Link to="/productos" className="nav-link" onClick={toggleMenu}><span className="nav-link-inner"><span className="nav-link-original">Productos</span><span className="nav-link-hover">Productos</span></span></Link></li>
                        <li className="nav-categoria-dropdown">
                            <div className="nav-link nav-link-categoria" onClick={toggleCategory}>
                                <span className="nav-link-text">Categoría</span>
                                <ChevronDown className={`nav-dropdown-icon ${categoryOpen ? 'rotate' : ''}`} size={18} />
                            </div>
                            <ul className={`dropdown-menu ${categoryOpen ? 'show' : ''}`}>
                                <li><Link to="/categoria/collares" className="dropdown-item" onClick={toggleMenu}>Collares</Link></li>
                                <li><Link to="/categoria/aretes" className="dropdown-item" onClick={toggleMenu}>Aretes</Link></li>
                                <li><Link to="/categoria/conjuntos" className="dropdown-item" onClick={toggleMenu}>Conjuntos</Link></li>
                                <li><Link to="/categoria/anillos" className="dropdown-item" onClick={toggleMenu}>Anillos</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/sobre-nosotros" className="nav-link" onClick={toggleMenu}><span className="nav-link-inner"><span className="nav-link-original sobre-nosotros">Sobre Nosotros</span><span className="nav-link-hover">Sobre Nosotros</span></span></Link></li>
                        <li><Link to="/contactanos" className="nav-link" onClick={toggleMenu}><span className="nav-link-inner"><span className="nav-link-original">Contáctanos</span><span className="nav-link-hover">Contáctanos</span></span></Link></li>
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
                    
                    <Link to="/login" className="nav-login-btn">
                        Iniciar Sesión
                    </Link>
                    
                    <Link to="/perfil" className="nav-icon nav-icon-user" aria-label="Perfil">
                        <User size={26} />
                    </Link>
                    
                    <Link to="/carrito" className="nav-icon nav-cart-icon" aria-label="Carrito de Compras">
                        <ShoppingCart size={26} />
                        {totalCount > 0 && (
                            <span className={`nav-cart-badge${bump ? ' bump' : ''}`}>{totalCount}</span>
                        )}
                    </Link>
                </div>
            </div>
            
            {/* Overlay para cerrar el menú en móvil */}
            {isOpen && isMobile && <div className="nav-overlay" onClick={() => setIsOpen(false)}></div>}
        </header>
    );
};

export default Nav;
