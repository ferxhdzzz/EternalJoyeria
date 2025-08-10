import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import Nav from '../components/Nav/Nav';
import './DetailProduct.css';
import { useCart } from '../context/CartContext';
import SidebarCart from '../components/Cart/SidebarCart';
import Footer from '../components/Footer';
import ReviewsSection from '../components/Reviews/ReviewsSection';

export default function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  if (!product) return <div style={{padding: 40}}>Producto no encontrado</div>;

  // Manejar añadir al carrito y abrir panel
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      description: product.description,
      image: product.images[0],
      price: product.price,
      quantity,
      size: selectedSize || 'default',
    });
    setCartOpen(true);
  };

  // Función para navegar a los ajustes de ubicación en el perfil
  const handleLocationClick = () => {
    navigate('/perfil?section=ubicacion');
  };

  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      <div style={{ height: '2.5rem' }} />
      <div className="detail-product-main" style={{ display: 'flex', gap: '1.5rem', margin: '6rem auto 3rem auto', maxWidth: 1200, alignItems: 'flex-start' }}>
        {/* Imagen principal */}
        <div className="detail-product-image-block" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ background: '#fff', borderRadius: '2rem', boxShadow: '0 2px 16px #eee', padding: '2.5rem', marginBottom: '1.5rem', width: 400, height: 550, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <img
              className="detail-product-image"
              src={product.images[selectedImage]}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.2rem', cursor: 'zoom-in' }}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPos({ x, y });
              }}
            />
            {zoom && (
              <div
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '1.2rem',
                  backgroundImage: `url(${product.images[selectedImage]})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200% 200%',
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  boxShadow: '0 0 0 9999px rgba(255,255,255,0.01)',
                  zIndex: 10,
                  border: '2px solid #eab5c5',
                  transition: 'background-position 0.1s',
                }}
              />
            )}
          </div>
        </div>
        {/* Detalles del producto */}
        <div className="detail-product-details" style={{ flex: 1, minWidth: 320, maxWidth: 370, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 0, marginTop: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 600, margin: 0, color: '#232323', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{product.title}</h2>
              <div style={{ color: '#bdbdbd', fontWeight: 500, fontSize: 14, margin: '4px 0 0 0' }}>{product.brand}</div>
            </div>
            <button style={{ background: '#f8c6d8', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 2 }}>
              <svg width="16" height="16" fill="none" stroke="#b48be4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4.75 12.5v6.75A2.75 2.75 0 0 0 7.5 22h9a2.75 2.75 0 0 0 2.75-2.75V12.5M12 2v13m0 0l-4-4m4 4l4-4"/></svg>
            </button>
          </div>
          <hr style={{ border: 0, borderTop: '1.5px solid #f3f3f3', margin: '14px 0 14px 0', width: '100%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#23233a', letterSpacing: '-0.5px' }}>${product.price.toFixed(2)}</span>
            <span style={{ textDecoration: 'line-through', color: '#bdbdbd', fontSize: 15, fontWeight: 500, marginLeft: 2 }}>${product.oldPrice.toFixed(2)}</span>
            <span style={{ background: '#fff3e6', color: '#f7b267', fontWeight: 700, borderRadius: 8, padding: '2px 8px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="12" height="12" fill="#f7b267" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {product.rating.toFixed(1)}
            </span>
            <span style={{ background: '#f3eaff', color: '#b48be4', fontWeight: 700, borderRadius: 8, padding: '2px 8px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="12" height="12" fill="#b48be4" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {product.reviews} reseñas
            </span>
          </div>
          <div style={{ color: '#4caf50', fontWeight: 600, fontSize: 12, marginBottom: 10, marginTop: 2 }}>{product.recommended}% de los compradores recomiendan este producto</div>
          <hr style={{ border: 0, borderTop: '1.5px solid #f3f3f3', margin: '14px 0 14px 0', width: '100%' }} />
          <div style={{ marginBottom: 12, width: '100%' }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: '#888', fontSize: 13 }}>Elige un tamaño</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {product.sizes.map(size => (
                <label key={size} style={{ fontWeight: 500, fontSize: 12, cursor: 'pointer', background: selectedSize === size ? '#f3eaff' : '#f5f5f5', color: selectedSize === size ? '#b48be4' : '#888', borderRadius: 7, padding: '4px 10px', border: selectedSize === size ? '2px solid #b48be4' : '2px solid #eee', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <input type='radio' name='size' value={size} checked={selectedSize === size} onChange={() => setSelectedSize(size)} style={{ accentColor: '#b48be4', marginRight: 3 }} />
                  {size}
                </label>
              ))}
            </div>
          </div>
          <hr style={{ border: 0, borderTop: '1.5px solid #f3f3f3', margin: '14px 0 14px 0', width: '100%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, width: '100%' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 32, height: 28, borderRadius: 14, background: '#f5f5f5', border: 'none', fontSize: 15, fontWeight: 700, color: '#888', cursor: 'pointer', transition: 'background 0.2s' }}>-</button>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#23233a', minWidth: 18, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} style={{ width: 32, height: 28, borderRadius: 14, background: '#f5f5f5', border: 'none', fontSize: 15, fontWeight: 700, color: '#888', cursor: 'pointer', transition: 'background 0.2s' }}>+</button>
            <button onClick={handleAddToCart} style={{ background: '#ffe6ef', color: '#b94a6c', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffd6de33', transition: 'background 0.18s, color 0.18s', letterSpacing: '0.5px', marginLeft: 12 }}>Añadir al carrito</button>
          </div>
          <hr style={{ border: 0, borderTop: '1.5px solid #f3f3f3', margin: '14px 0 14px 0', width: '100%' }} />
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: '0.6rem 0.8rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #f3eaff', width: '100%' }}>
            <svg width="14" height="14" fill="none" stroke="#b48be4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
            <div>
              <div style={{ fontWeight: 700, color: '#23233a', fontSize: 11 }}>Envio gratis a El Salvador</div>
              <div 
                onClick={handleLocationClick}
                style={{ color: '#b48be4', fontWeight: 500, fontSize: 10, textDecoration: 'underline', cursor: 'pointer', marginTop: 1 }}
              >
                Ingresa para ver tu ubicacion
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #f3eaff', width: '100%' }}>
            <svg width="14" height="14" fill="none" stroke="#b48be4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
            <div>
              <div style={{ fontWeight: 700, color: '#23233a', fontSize: 11 }}>Rembolsos</div>
              <div style={{ color: '#888', fontWeight: 500, fontSize: 10 }}>Los reembolsos son permitidos unicamente en caso de deterioro</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de reseñas */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <ReviewsSection 
          productId={product.id} 
          productName={product.title} 
        />
      </div>
      
      <Footer />
    </>
  );
} 