import React from 'react';
import { Link } from 'react-router-dom';

const ProductsMenu = ({ isMobile, toggleMenu, location }) => {
    return (
        <li>
            <Link 
                to="/productos" 
                className={`nav-link${location.pathname.startsWith('/productos') ? ' active' : ''}`} 
                onClick={toggleMenu}
            >
                <span className="nav-link-inner">Productos</span>
            </Link>
        </li>
    );
};

export default ProductsMenu; 