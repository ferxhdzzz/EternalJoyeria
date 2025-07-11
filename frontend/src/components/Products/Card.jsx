import React, { useRef } from "react";
import "./Card.css";
import { useNavigate } from 'react-router-dom';

export default function Card({ style, title, description, image, oldPrice, price, imageHeight, simplePrice, id, onAddToCart }) {
  const navigate = useNavigate();
  const btnRef = useRef();

  // Animación de rebote en el botón
  const handleAddToCartClick = (productData) => {
    if (btnRef.current) {
      btnRef.current.classList.remove('bounce');
      void btnRef.current.offsetWidth; // trigger reflow
      btnRef.current.classList.add('bounce');
    }
    if (onAddToCart) onAddToCart(productData);
  };

  // Datos del producto para el carrito
  const productData = {
    id: id || title || description,
    name: title || 'Conjunto Floral',
    description: description || 'Elegante conjunto con diseño floral',
    image: image || '/Products/ConjuntoEternal.png',
    price: price ? parseFloat(price.replace('$','')) : 69.99,
    quantity: 1,
    size: 'default',
  };
  return (
    <div className="card card-interactive" style={style}>
      <div className="card__shine"></div>
      <div className="card__glow"></div>
      <div className="card__content" style={{ padding: '1.5em', height: '100%', display: 'flex', flexDirection: 'column', gap: '1em', position: 'relative', zIndex: 2 }}>
        {!simplePrice && <div className="card__badge">OFERTA</div>}
        <div className="card__image card__image-zoom" style={{ 
          width: '100%', 
          aspectRatio: (title === 'Aretes Elegantes' || title === 'Pulsera Rosa' || title === 'Anillo Pastel') ? '4/3' : '1/1', 
          marginBottom: '10px', 
          borderRadius: '15px', 
          overflow: 'hidden', 
          boxShadow: '0 8px 12px rgba(0,0,0,0.15)', 
          background: '#fff', 
          border: '1.5px solid #e0e0e0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img 
            src={image || '/Products/ConjuntoEternal.png'} 
            alt={title || 'Producto'} 
            className={(title === 'Aretes Elegantes' || title === 'Pulsera Rosa' || title === 'Anillo Pastel') ? 'card__image--zoomed' : ''}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block', 
              background: 'linear-gradient(45deg, #f9dce0, #f6bfcf)',
              transform: (title === 'Aretes Elegantes' || title === 'Pulsera Rosa' || title === 'Anillo Pastel') ? 'scale(2)' : 'none',
              transition: 'transform 0.25s cubic-bezier(.77,0,.18,1)'
            }}
          />
        </div>
        <div className="card__text" style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
          <p className="card__title" style={{ color: '#263238', fontSize: '1.1em', margin: 0, fontWeight: 600 }}>{title || 'Conjunto Floral'}</p>
          <p className="card__description" style={{ color: '#263238', fontSize: '0.9em', margin: 0, opacity: 0.8 }}>{description || 'Elegante conjunto con diseño floral'}</p>
        </div>
        <div className="card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div className="card__price" style={{ display: 'flex', flexDirection: 'column', color: '#263238', fontSize: '1em' }}>
            {!simplePrice && <span className="price-old" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em' }}>{oldPrice || '$89.99'}</span>}
            <span className="price-current" style={{ fontWeight: 700, fontSize: '1.1em' }}>{price || '$69.99'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
            <div className="card__button" style={{ width: '28px', height: '28px', background: '#474747', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'none', transform: 'scale(0.9)' }} onClick={() => id ? navigate(`/detalle-producto/${id}`) : navigate('/detalle-producto')}>
              <svg height="16" width="16" viewBox="0 0 24 24">
                <path
                  strokeWidth="2"
                  stroke="white"
                  d="M4 12H20M12 4V20"
                  fill="white"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 