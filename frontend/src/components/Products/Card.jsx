// Importaciones necesarias para el componente de tarjeta de producto
import React, { useRef } from "react"; // React y hook para referencias
import "./Card.css"; // Estilos CSS específicos de las tarjetas
import { useNavigate } from 'react-router-dom'; // Hook para navegación programática

// Componente de tarjeta de producto - Muestra información de un producto individual
export default function Card({ 
  style, // Estilos inline opcionales
  title, // Título del producto
  description, // Descripción del producto
  image, // URL de la imagen del producto
  oldPrice, // Precio anterior (para mostrar descuento)
  price, // Precio actual
  imageHeight, // Altura de la imagen (no usado actualmente)
  simplePrice, // Si es true, no muestra el badge "OFERTA"
  id, // ID único del producto
  onAddToCart // Función callback para agregar al carrito
}) {
  const navigate = useNavigate(); // Hook para navegación
  const btnRef = useRef(); // Referencia para el botón de agregar al carrito

  // Función para manejar la animación de rebote en el botón de agregar al carrito
  const handleAddToCartClick = (productData) => {
    if (btnRef.current) {
      btnRef.current.classList.remove('bounce'); // Remover clase de rebote
      void btnRef.current.offsetWidth; // Forzar reflow del DOM para reiniciar animación
      btnRef.current.classList.add('bounce'); // Agregar clase de rebote
    }
    if (onAddToCart) onAddToCart(productData); // Llamar función callback si existe
  };

  // Objeto con los datos del producto para el carrito
  const productData = {
    id: id || title || description, // ID único del producto
    name: title || 'Conjunto Floral', // Nombre del producto (valor por defecto)
    description: description || 'Elegante conjunto con diseño floral', // Descripción (valor por defecto)
    image: image || '/Products/ConjuntoEternal.png', // Imagen (valor por defecto)
    price: price ? parseFloat(price.replace('$','')) : 69.99, // Precio convertido a número
    quantity: 1, // Cantidad inicial
    size: 'default', // Tamaño por defecto
  };
  // Estructura JSX de la tarjeta de producto
  return (
    <div className="card card-interactive" style={style}> {/* Contenedor principal de la tarjeta */}
      <div className="card__shine"></div> {/* Efecto de brillo en hover */}
      <div className="card__glow"></div> {/* Efecto de resplandor en hover */}
      
      {/* Contenido principal de la tarjeta */}
      <div className="card__content" style={{ padding: '1.5em', height: '100%', display: 'flex', flexDirection: 'column', gap: '1em', position: 'relative', zIndex: 2 }}>
        
        {/* Badge de oferta - solo se muestra si simplePrice es false */}
        {!simplePrice && <div className="card__badge">OFERTA</div>}
        
        {/* Contenedor de la imagen del producto */}
        <div className="card__image card__image-zoom" style={{ 
          width: '100%', 
          // Aspect ratio especial para productos específicos (aretes, pulseras, anillos)
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
          {/* Imagen del producto */}
          <img 
            src={image || '/Products/ConjuntoEternal.png'} 
            alt={title || 'Producto'} 
            // Clase especial para zoom en productos específicos
            className={(title === 'Aretes Elegantes' || title === 'Pulsera Rosa' || title === 'Anillo Pastel') ? 'card__image--zoomed' : ''}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block', 
              background: 'linear-gradient(45deg, #f9dce0, #f6bfcf)', // Fondo degradado
              // Transformación especial para productos específicos (zoom 2x)
              transform: (title === 'Aretes Elegantes' || title === 'Pulsera Rosa' || title === 'Anillo Pastel') ? 'scale(2)' : 'none',
              transition: 'transform 0.25s cubic-bezier(.77,0,.18,1)' // Transición suave
            }}
          />
        </div>
        
        {/* Contenedor del texto (título y descripción) */}
        <div className="card__text" style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
          <p className="card__title" style={{ color: '#263238', fontSize: '1.1em', margin: 0, fontWeight: 600 }}>{title || 'Conjunto Floral'}</p>
          <p className="card__description" style={{ color: '#263238', fontSize: '0.9em', margin: 0, opacity: 0.8 }}>{description || 'Elegante conjunto con diseño floral'}</p>
        </div>
        
        {/* Pie de la tarjeta - precios y botón */}
        <div className="card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          {/* Contenedor de precios */}
          <div className="card__price" style={{ display: 'flex', flexDirection: 'column', color: '#263238', fontSize: '1em' }}>
            {/* Precio anterior tachado - solo se muestra si simplePrice es false */}
            {!simplePrice && <span className="price-old" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em' }}>{oldPrice || '$89.99'}</span>}
            {/* Precio actual */}
            <span className="price-current" style={{ fontWeight: 700, fontSize: '1.1em' }}>{price || '$69.99'}</span>
          </div>
          
          {/* Contenedor del botón */}
          <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center' }}>
            {/* Botón circular para ver detalles del producto */}
            <div className="card__button" style={{ width: '28px', height: '28px', background: '#474747', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'none', transform: 'scale(0.9)' }} onClick={() => id ? navigate(`/detalle-producto/${id}`) : navigate('/detalle-producto')}>
              {/* Icono de plus (+) */}
              <svg height="16" width="16" viewBox="0 0 24 24">
                <path
                  strokeWidth="2"
                  stroke="white"
                  d="M4 12H20M12 4V20" // Path para crear el símbolo +
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