// Importaciones necesarias para el componente de navegación
import React, { useState, useEffect, useRef } from 'react'; // React y hooks para estado, efectos y referencias
import { Link, useLocation } from 'react-router-dom'; // Componentes para navegación y obtener ubicación actual
import './Nav.css'; // Estilos CSS específicos de la navegación
import { Menu, X, User } from 'lucide-react'; // Iconos de la librería Lucide React
import { useCart } from '../../context/CartContext'; // Hook personalizado para el carrito de compras
import CleanLogo from './CleanLogo'; // Componente del logo limpio
import ProductsMenu from './ProductsMenu'; // Componente del menú de productos

// Componente del icono de carrito personalizado más compacto
const CartIcon = ({ size = 24 }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ minWidth: size, minHeight: size }}
    >
        {/* Path principal del carrito */}
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        {/* Línea superior del carrito */}
        <line x1="3" y1="6" x2="21" y2="6"/>
        {/* Asa del carrito */}
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

// Componente principal de navegación
const Nav = ({ cartOpen = false }) => {
    // Estados para controlar el comportamiento de la navegación
    const [isOpen, setIsOpen] = useState(false); // Estado del menú móvil (abierto/cerrado)
    const { cartItems } = useCart(); // Obtener items del carrito desde el contexto
    const [bump, setBump] = useState(false); // Estado para animación de rebote del badge del carrito
    const prevCount = useRef(0); // Referencia para el conteo anterior de items
    
    // Calcular el total de items en el carrito
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    // Estados para detectar diferentes tamaños de pantalla
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000); // Pantallas móviles (≤1000px)
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480); // Pantallas pequeñas (≤480px)
    const [isTinyMobile, setIsTinyMobile] = useState(window.innerWidth <= 320); // Pantallas muy pequeñas (≤320px)
    
    // Referencias para elementos del DOM
    const menuRef = useRef(null); // Referencia al menú móvil
    const toggleRef = useRef(null); // Referencia al botón de toggle
    const location = useLocation(); // Hook para obtener la ubicación actual

    // Efecto: Cerrar menús al cambiar de página
    useEffect(() => {
        setIsOpen(false); // Cerrar el menú móvil cuando cambia la página
    }, [location.pathname]);

    // Efecto: Detectar si es un dispositivo móvil y manejar cambios de tamaño
    useEffect(() => {
        const handleResize = () => {
            // Detectar diferentes tamaños de pantalla
            const newIsMobile = window.innerWidth <= 1000;
            const newIsSmallMobile = window.innerWidth <= 480;
            const newIsTinyMobile = window.innerWidth <= 320;
            
            // Actualizar estados de tamaño de pantalla
            setIsMobile(newIsMobile);
            setIsSmallMobile(newIsSmallMobile);
            setIsTinyMobile(newIsTinyMobile);
            
            // Si no es móvil, cerrar el menú
            if (!newIsMobile) {
                setIsOpen(false);
            }
        };
        
        // Agregar listener para cambios de tamaño de ventana
        window.addEventListener('resize', handleResize);
        handleResize(); // Llamada inicial para establecer el estado correcto
        
        // Limpiar listener al desmontar
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Efecto: Manejo de clics fuera del menú para cerrarlo
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Verificar que las referencias existan
            if (!menuRef.current || !toggleRef.current) return;
            
            // Si el menú está abierto y se hace clic fuera, cerrarlo
            if (isOpen && 
                !menuRef.current.contains(e.target) && 
                !toggleRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        
        // Agregar listener para clics en el documento
        document.addEventListener('mousedown', handleClickOutside);
        
        // Limpiar listener al desmontar
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Efecto: Animación de rebote cuando cambia el número de items en el carrito
    useEffect(() => {
        if (totalCount !== prevCount.current) {
            setBump(true); // Activar animación de rebote
            prevCount.current = totalCount; // Actualizar conteo anterior
            const timer = setTimeout(() => setBump(false), 400); // Desactivar después de 400ms
            return () => clearTimeout(timer); // Limpiar timer si el componente se desmonta
        }
    }, [totalCount]);

    // Función para alternar el estado del menú móvil
    const toggleMenu = (e) => {
        if (e) e.stopPropagation(); // Prevenir propagación del evento
        setIsOpen(!isOpen); // Alternar estado abierto/cerrado
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
                    
                    <Link to="/login" className="nav-login-btn">
                        Iniciar Sesión
                    </Link>
                    
                    <Link to="/perfil" className="nav-icon nav-icon-user" aria-label="Perfil">
                        <User size={22} />
                    </Link>
                    
                    <Link to="/carrito" className="nav-icon nav-cart-icon" aria-label="Carrito de Compras">
                        <CartIcon size={22} />
                        {totalCount > 0 && (
                            <span className={`nav-cart-badge${bump ? ' bump' : ''}`}>{totalCount}</span>
                        )}
                    </Link>
                </div>
                </div>
            </header>
            
            {/* Overlay para cerrar el menú en móvil */}
            {/* {isOpen && isMobile && <div className="nav-overlay" onClick={() => setIsOpen(false)}></div>} */}
        </>
    );
};

export default Nav;
