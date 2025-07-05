import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import { Menu, X } from 'lucide-react';
import { User, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Nav = ({ cartOpen = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartItems } = useCart();
    const [bump, setBump] = useState(false);
    const prevCount = useRef(0);
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (totalCount !== prevCount.current) {
            setBump(true);
            prevCount.current = totalCount;
            const timer = setTimeout(() => setBump(false), 400);
            return () => clearTimeout(timer);
        }
    }, [totalCount]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className={`header ${cartOpen ? 'header--cart-open' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src="/Products/EternalLogo.png" alt="Eternal Joyeria Logo" className="logo-image" />
                </Link>

                <div className={`nav-menu ${isOpen ? 'show-menu' : ''} ${cartOpen ? 'nav-menu--cart-open' : ''}`}>
                    <ul className="nav-list">
                        <li><Link to="/productos" className="nav-link" onClick={toggleMenu}><span className="nav-link-inner"><span className="nav-link-original">Productos</span><span className="nav-link-hover">Productos</span></span></Link></li>
                        <li className="nav-categoria-dropdown">
                          <span className="nav-link nav-link-categoria">Categoría</span>
                          <ul className="dropdown-menu">
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
                    <Link to="/perfil" className="nav-icon" aria-label="Perfil">
                        <User size={26} />
                    </Link>
                    <Link to="/carrito" className="nav-icon nav-cart-icon" aria-label="Carrito de Compras">
                        <ShoppingCart size={26} />
                        {totalCount > 0 && (
                            <span className={`nav-cart-badge${bump ? ' bump' : ''}`}>{totalCount}</span>
                        )}
                    </Link>
                    <Link to="/login" className="nav-login-btn">Iniciar Sesión</Link>
                    <div className="nav-toggle" onClick={toggleMenu}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Nav;
