// ProductDetail.js - VERSIÓN CON MODAL DE DETALLES CON UNA SOLA IMAGEN
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useProductDetails from '../hooks/Products/useProductDetails';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import ReviewsSection from '../components/Reviews/ReviewsSection';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const { product, loading, error, refetch } = useProductDetails(id);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // DEBUG COMPLETO
  console.log('=== DEBUG PRODUCT DETAIL ===');
  console.log('URL actual:', window.location.href);
  console.log('Pathname:', location.pathname);
  console.log('ID desde useParams:', id);
  console.log('Tipo de ID:', typeof id);
  console.log('ID válido:', !!id);
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Product:', product);
  console.log('Product ID:', product?._id);

  // Actualizar tamaño seleccionado cuando se carga el producto
  React.useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else if (product) {
      setSelectedSize('Pequeño');
    }
  }, [product]);

  // Componente Modal de Detalles
  const DetailsModal = () => {
    if (!showDetailsModal) return null;

    return (
      <div 
        className="modal-overlay" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '20px'
        }}
        onClick={() => setShowDetailsModal(false)}
      >
        <div 
          className="modal-content" 
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón de cerrar */}
          <button 
            onClick={() => setShowDetailsModal(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            ×
          </button>

          {/* Contenido del modal */}
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {/* Imagen del producto */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <img 
                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'} 
                alt={product.name}
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Detalles del producto */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h2 style={{ fontSize: '2em', marginBottom: '20px', color: '#333' }}>
                {product.name}
              </h2>

              {/* Precio */}
              <div style={{ marginBottom: '25px' }}>
                {product.finalPrice && product.finalPrice !== product.price && (
                  <span style={{ 
                    textDecoration: 'line-through', 
                    color: '#999', 
                    marginRight: '15px',
                    fontSize: '1.2em'
                  }}>
                    ${(product.price || 0).toFixed(2)}
                  </span>
                )}
                <span style={{ 
                  fontSize: '1.8em', 
                  fontWeight: 'bold', 
                  color: '#D1A6B4' 
                }}>
                  ${(product.finalPrice || product.price || 0).toFixed(2)}
                </span>
              </div>

              {/* Descripción detallada */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#333' }}>
                  Descripción Completa
                </h3>
                <p style={{ lineHeight: '1.6', color: '#666', fontSize: '16px' }}>
                  {product.description || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Especificaciones técnicas */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '15px', color: '#333' }}>
                  Especificaciones
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {product.measurements && (
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Medidas:</strong><br/>
                      <span style={{ color: '#666' }}>
                        {typeof product.measurements === 'object' ? (
                          <>
                            {product.measurements.width && `Ancho: ${product.measurements.width}cm `}
                            {product.measurements.height && `Alto: ${product.measurements.height}cm `}
                            {product.measurements.weight && `Peso: ${product.measurements.weight}g`}
                          </>
                        ) : (
                          product.measurements
                        )}
                      </span>
                    </div>
                  )}
                  {product.material && (
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Material:</strong><br/>
                      <span style={{ color: '#666' }}>{product.material}</span>
                    </div>
                  )}
                  {(product.weight || product.measurements?.weight) && (
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Peso:</strong><br/>
                      <span style={{ color: '#666' }}>
                        {product.weight || product.measurements?.weight}g
                      </span>
                    </div>
                  )}
                  {product.color && (
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Color:</strong><br/>
                      <span style={{ color: '#666' }}>{product.color}</span>
                    </div>
                  )}
                  {product.stock !== undefined && (
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Stock:</strong><br/>
                      <span style={{ 
                        color: product.stock < 3 ? '#dc3545' : '#666',
                        fontWeight: product.stock < 3 ? 'bold' : 'normal'
                      }}>{product.stock} unidades</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Disponibilidad */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#333' }}>
                  Disponibilidad
                </h3>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {product.stock !== undefined && (
                    <div style={{ 
                      padding: '8px 15px', 
                      background: product.stock === 0 ? '#f8d7da' : product.stock < 3 ? '#f8d7da' : '#d4edda',
                      color: product.stock === 0 ? '#721c24' : product.stock < 3 ? '#721c24' : '#155724',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {product.stock === 0 ? 'Sin stock' : product.stock < 3 ? `${product.stock} en stock (¡Pocas unidades!)` : `${product.stock} en stock`}
                    </div>
                  )}
                  <div style={{ 
                    padding: '8px 15px', 
                    background: '#cce5ff',
                    color: '#004085',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Envío disponible
                  </div>
                </div>
              </div>

              {/* Tamaños disponibles */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#333' }}>
                  Tamaños Disponibles
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(product.sizes || ['Pequeño', 'Mediano', 'Grande']).map(size => (
                    <span 
                      key={size}
                      style={{
                        padding: '6px 12px',
                        background: '#e9ecef',
                        border: '1px solid #ced4da',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#333' }}>
                  Información Adicional
                </h3>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#666' }}>
                  <li>Producto original y de alta calidad</li>
                  <li>Política de devoluciones: 30 días</li>
                  <li>Garantía de satisfacción</li>
                  <li>Soporte al cliente 24/7</li>
                  <li>Envoltorio de regalo disponible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        
        <div className="product-detail-page" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '20px',
            padding: '40px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #D1A6B4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h2>Cargando producto...</h2>
            <p><strong>ID buscado:</strong> {id || 'ID no definido'}</p>
            <p><strong>URL:</strong> {window.location.pathname}</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        
        <div className="product-detail-page" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div style={{ padding: '40px' }}>
            <h2 style={{ color: '#e74c3c' }}>Error al cargar el producto</h2>
            <div style={{ 
              background: '#f8f9fa', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px', 
              margin: '20px 0',
              textAlign: 'left'
            }}>
              <p><strong>ID buscado:</strong> {id || 'ID no definido'}</p>
              <p><strong>URL actual:</strong> {window.location.href}</p>
              <p><strong>Error:</strong> {error}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
            </div>
            <button 
              onClick={refetch} 
              style={{ 
                padding: '10px 20px', 
                margin: '10px', 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Reintentar
            </button>
            <button 
              onClick={() => window.history.back()} 
              style={{ 
                padding: '10px 20px', 
                margin: '10px', 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              ← Volver
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        
        <div className="product-detail-page" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div style={{ padding: '40px' }}>
            <h2>Producto no encontrado</h2>
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px', 
              padding: '20px', 
              margin: '20px 0'
            }}>
              <p><strong>ID buscado:</strong> {id || 'ID no definido'}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
              <p>El producto con este ID no existe en la base de datos o no se pudo cargar.</p>
            </div>
            <button 
              onClick={refetch} 
              style={{ 
                padding: '10px 20px', 
                margin: '10px', 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Reintentar
            </button>
            <button 
              onClick={() => window.history.back()} 
              style={{ 
                padding: '10px 20px', 
                margin: '10px', 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              ← Volver
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    // Si la cantidad es 0 o el stock es 0, no hacer nada
    if (quantity === 0 || product.stock === 0) {
      Swal.fire({
        title: 'Sin stock disponible',
        text: 'Este producto no tiene stock o la cantidad seleccionada es 0.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#D1A6B4',
      });
      return;
    }

    // Verificar si la cantidad a agregar es mayor que el stock disponible
    if (quantity > product.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo quedan ${product.stock} unidad(es) de este producto.`,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#D1A6B4',
      });
      return;
    }

    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : product.img,
      size: selectedSize,
      quantity: quantity
    };
    
    addToCart(productToAdd);
    Swal.fire({
      title: '¡Añadido al carrito!',
      text: `${product.name} ahora está en tu carrito.`,
      icon: 'success',
      confirmButtonText: 'Genial',
      confirmButtonColor: '#D1A6B4',
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const handleIncreaseQuantity = () => {
    // Evitar que la cantidad supere el stock
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    } else {
      Swal.fire({
        title: 'Límite de stock',
        text: `No puedes añadir más de ${product.stock} unidad(es) de este producto.`,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#D1A6B4',
      });
    }
  };

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['Pequeño', 'Mediano', 'Grande'];

  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      
      {/* MODAL DE DETALLES */}
      <DetailsModal />
      
      <div className="product-detail-page" style={{ paddingTop: '80px' }}>
        <div className="product-detail-container" style={{ 
          display: 'flex', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '40px 20px',
          gap: '40px'
        }}>
          
          {/* SECCIÓN DE IMAGEN */}
          <div className="product-image-section" style={{ flex: '1' }}>
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'} 
              alt={product.name} 
              className="main-product-image"
              style={{ 
                width: '100%', 
                borderRadius: '15px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
              }}
              onError={(e) => {
                console.log('Error cargando imagen:', e.target.src);
                e.target.src = '/placeholder-image.jpg';
              }}
            />

          </div>
          
          {/* SECCIÓN DE INFORMACIÓN */}
          <div className="product-info-section" style={{ flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '2.5em', margin: 0 }}>{product.name}</h1>
              {/* BOTÓN + PARA MÁS DETALLES */}
              <button 
                onClick={() => setShowDetailsModal(true)}
                style={{ 
                  background: '#D1A6B4', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(209, 166, 180, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 6px 20px rgba(209, 166, 180, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(209, 166, 180, 0.3)';
                }}
                title="Ver más detalles del producto"
              >
                +
              </button>
            </div>
            
            <div className="price-container" style={{ marginBottom: '30px' }}>
              {product.finalPrice && product.finalPrice !== product.price && (
                <span className="old-price" style={{ 
                  textDecoration: 'line-through', 
                  color: '#999', 
                  marginRight: '10px',
                  fontSize: '1.2em'
                }}>
                  ${(product.price || 0).toFixed(2)}
                </span>
              )}
              <span className="current-price" style={{ 
                fontSize: '2em', 
                fontWeight: 'bold', 
                color: '#D1A6B4' 
              }}>
                ${(product.finalPrice || product.price || 0).toFixed(2)}
              </span>
            </div>
            
            <div className="size-selector" style={{ marginBottom: '30px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Seleccionar tamaño</p>
              <div className="sizes" style={{ display: 'flex', gap: '10px' }}>
                {availableSizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '10px 15px',
                      border: selectedSize === size ? '2px solid #D1A6B4' : '2px solid #ddd',
                      background: selectedSize === size ? '#D1A6B4' : 'white',
                      color: selectedSize === size ? 'white' : '#333',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: '#D1A6B4', 
                  border: 'none', 
                  fontSize: 18, 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                -
              </button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                onClick={handleIncreaseQuantity} 
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: '#D1A6B4', 
                  border: 'none', 
                  fontSize: 18, 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                +
              </button>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <button 
                onClick={handleAddToCart} 
                style={{ 
                  background: '#D1A6B4', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '15px 30px', 
                  fontSize: 18, 
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                AÑADIR AL CARRITO
              </button>
            </div>
            
            <div className="description">
              <p><strong>Descripción</strong></p>
              <p style={{ lineHeight: '1.6', color: '#666' }}>
                {product.description || 'Sin descripción disponible.'}
              </p>
            </div>
            
            {/* BOTÓN ADICIONAL PARA VER MÁS DETALLES */}
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setShowDetailsModal(true)}
                style={{ 
                  background: 'transparent', 
                  color: '#D1A6B4', 
                  border: '2px solid #D1A6B4', 
                  borderRadius: '8px', 
                  padding: '10px 20px', 
                  fontSize: '16px', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#D1A6B4';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#D1A6B4';
                }}
              >
                Ver detalles completos
              </button>
            </div>
            
            {/* INFO ADICIONAL */}
            {product.measurements && (
              <div style={{ marginTop: '20px' }}>
                <p>
                  <strong>Medidas:</strong>{' '}
                  {typeof product.measurements === 'object' ? (
                    <>
                      {product.measurements.width && `${product.measurements.width}cm (ancho) `}
                      {product.measurements.height && `${product.measurements.height}cm (alto) `}
                      {product.measurements.weight && `${product.measurements.weight}g (peso)`}
                    </>
                  ) : (
                    product.measurements
                  )}
                </p>
              </div>
            )}
            
            {product.stock !== undefined && (
              <div style={{ marginTop: '20px' }}>
                <p><strong>Stock:</strong> <span style={{ 
                  color: product.stock < 3 ? '#dc3545' : '#333',
                  fontWeight: product.stock < 3 ? 'bold' : 'normal'
                }}>{product.stock} unidades disponibles</span></p>
              </div>
            )}
          </div>
        </div>
        
        {/* SECCIÓN DE RESEÑAS */}
        <ReviewsSection 
          productId={product._id}
          productName={product.name}
        />
      </div>
      <Footer />
      
      {/* ESTILOS CSS PARA LA ANIMACIÓN DE LOADING */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>    </>
  );
};

export default ProductDetail;