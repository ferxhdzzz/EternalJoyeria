// ProductDetail.js - VERSIÓN CON MÚLTIPLES IMÁGENES Y MODAL DE DETALLES
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useProductDetails from '../hooks/Products/useProductDetails';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import ReviewsSection from '../components/Reviews/ReviewsSection';
 
// URL de imagen por defecto
const DEFAULT_IMAGE_URL = '/placeholder-image.jpg';
 
const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const { product, loading, error, refetch } = useProductDetails(id);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
 
  // NUEVO ESTADO: Índice de la imagen principal para el carrusel
  const [mainImageIndex, setMainImageIndex] = useState(0);
 
  // DEBUG COMPLETO (Se mantiene por si es necesario)
  // console.log('=== DEBUG PRODUCT DETAIL ===');
  // console.log('Product:', product);
 
  // Actualizar tamaño seleccionado e índice de imagen cuando se carga el producto
  React.useEffect(() => {
    if (product) {
      // 1. Tamaño
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Pequeño'); // Fallback si no hay tallas
      }
      // 2. Reiniciar índice de imagen
      setMainImageIndex(0);
    }
  }, [product]);
 
  // Función para obtener la URL de la imagen actual
  const getCurrentImageUrl = () => {
    if (product && product.images && product.images.length > mainImageIndex) {
      return product.images[mainImageIndex];
    }
    return product && product.img ? product.img : DEFAULT_IMAGE_URL; // Fallback al campo 'img' o a la imagen por defecto
  };
 
  // Componente Modal de Detalles
  const DetailsModal = () => {
    if (!showDetailsModal || !product) return null;
 
    // Usaremos la primera imagen o una por defecto para el modal
    const modalImageUrl = product.images && product.images.length > 0 ? product.images[0] : (product.img || DEFAULT_IMAGE_URL);
 
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
            {/* Imagen del producto (usando la primera imagen del array) */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <img
                src={modalImageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
            </div>
 
            {/* Detalles del producto (mismo contenido que antes) */}
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
                      <span style={{ color: '#666' }}>{product.stock} unidades</span>
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
                      background: product.stock > 0 ? '#d4edda' : '#f8d7da',
                      color: product.stock > 0 ? '#155724' : '#721c24',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
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
 
  // Lógicas de carga y error (se mantienen sin cambios)
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
          </div>
        </div>
      </>
    );
  }
 
  if (error || !product) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
       
        <div className="product-detail-page" style={{ paddingTop: '100px', textAlign: 'center' }}>
          <div style={{ padding: '40px' }}>
            <h2 style={{ color: '#e74c3c' }}>Error al cargar o Producto no encontrado</h2>
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              margin: '20px 0',
              textAlign: 'left'
            }}>
              <p><strong>ID buscado:</strong> {id || 'ID no definido'}</p>
              <p><strong>Error:</strong> {error || 'No se recibió la información del producto.'}</p>
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
 
  // Lógica de añadir al carrito y manejo de cantidad (se mantienen sin cambios)
  const handleAddToCart = () => {
    // Convertimos product.stock a entero para hacer comparaciones seguras
    const currentStock = parseInt(product.stock, 10); 
 
    if (quantity === 0 || currentStock === 0 || isNaN(currentStock)) {
      Swal.fire({
        title: 'Sin stock disponible',
        text: 'Este producto no tiene stock o la cantidad seleccionada es 0.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#D1A6B4',
      });
      return;
    }
 
    if (quantity > currentStock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo quedan ${currentStock} unidad(es) de este producto.`,
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
      // Usamos la primera imagen para el carrito por convención
      image: product.images && product.images.length > 0 ? product.images[0] : product.img,
      size: selectedSize,
      quantity: quantity,
      stock: currentStock // <<<< ¡STOCK AHORA ES NÚMERO Y SE PASA AL CONTEXTO!
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
  // Obtenemos el array de imágenes o un array con la imagen por defecto
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.img || DEFAULT_IMAGE_URL];
  // URL de la imagen principal a mostrar
  const mainImage = getCurrentImageUrl();
 
 
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
          gap: '40px',
          flexWrap: 'wrap' // Permite que se apilen en pantallas pequeñas
        }}>
         
          {/* SECCIÓN DE IMAGEN (CARRUSEL) */}
          <div className="product-image-section" style={{ flex: '1', minWidth: '350px' }}>
            <img
              src={mainImage}
              alt={`${product.name} - Vista ${mainImageIndex + 1}`}
              className="main-product-image"
              style={{
                width: '100%',
                aspectRatio: '1 / 1', // Asegura un ratio cuadrado o ajusta a tus necesidades
                objectFit: 'cover',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE_URL;
              }}
            />
 
            {/* Miniaturas de imágenes */}
            {productImages.length > 1 && (
              <div className="thumbnail-gallery" style={{
                display: 'flex',
                marginTop: '15px',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '10px'
              }}>
                {productImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    onClick={() => setMainImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: index === mainImageIndex ? '3px solid #D1A6B4' : '1px solid #ddd',
                      opacity: index === mainImageIndex ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>
         
          {/* SECCIÓN DE INFORMACIÓN (Se mantiene el contenido principal) */}
          <div className="product-info-section" style={{ flex: '1', minWidth: '350px' }}>
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
                <p><strong>Stock:</strong> {product.stock} unidades disponibles</p>
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
 
export default ProductDetail;