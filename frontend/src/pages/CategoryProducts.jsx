import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import Nav from "../components/Nav/Nav";
import Footer from '../components/Footer';
import './CategoryProducts.css';

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal de detalles
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Obtener productos por categoría desde la API
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`https://eternaljoyeria-cg5d.onrender.com/api/products/category/${id}`);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  // Funciones del modal de detalles
  const openDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
    setQuantity(1);
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('Pequeño');
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setQuantity(1);
  };

  // Añadir producto al carrito
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const productToAdd = {
      id: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.finalPrice || selectedProduct.price,
      image: selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : selectedProduct.img,
      size: selectedSize,
      quantity: quantity
    };
    
    addToCart(productToAdd);
    
    Swal.fire({
      title: '¡Añadido al carrito!',
      text: `${selectedProduct.name} ahora está en tu carrito.`,
      icon: 'success',
      confirmButtonText: 'Genial',
      confirmButtonColor: '#D1A6B4',
      timer: 2500,
      timerProgressBar: true,
    });
    
    closeDetailsModal();
  };

  // Modal de detalles del producto
  const DetailsModal = () => {
    if (!showDetailsModal || !selectedProduct) return null;

    const product = selectedProduct;
    const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['Pequeño', 'Mediano', 'Grande'];

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
        onClick={closeDetailsModal}
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
          {/* Botón cerrar modal */}
          <button 
            onClick={closeDetailsModal}
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

          {/* Contenido principal del modal */}
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

            {/* Información del producto */}
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

              {/* Descripción */}
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

              {/* Estado de disponibilidad */}
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

              {/* Selector de tamaño */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#333' }}>
                  Seleccionar tamaño
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {availableSizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '10px 15px',
                        border: selectedSize === size ? '2px solid #D1A6B4' : '2px solid #ddd',
                        background: selectedSize === size ? '#D1A6B4' : 'white',
                        color: selectedSize === size ? 'white' : '#333',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de cantidad */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#333' }}>
                  Cantidad
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      background: '#D1A6B4', 
                      border: 'none', 
                      color: 'white',
                      fontSize: '18px', 
                      fontWeight: '700', 
                      cursor: 'pointer' 
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      background: '#D1A6B4', 
                      border: 'none', 
                      color: 'white',
                      fontSize: '18px', 
                      fontWeight: '700', 
                      cursor: 'pointer' 
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botón añadir al carrito */}
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={handleAddToCart} 
                  style={{ 
                    background: '#D1A6B4', 
                    color: 'white', 
                    fontWeight: 'bold', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '15px 30px', 
                    fontSize: '18px', 
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  AÑADIR AL CARRITO
                </button>
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

  // Estados de carga y error
  if (loading) return (
    <>
      <Nav />
      <p className="loading-text" style={{ marginTop: '120px' }}>Cargando productos...</p>
      <Footer />
    </>
  );
  
  if (products.length === 0) return (
    <>
      <Nav />
      <p className="loading-text" style={{ marginTop: '120px' }}>No hay productos en esta categoría.</p>
      <Footer />
    </>
  );

  return (
    <>
      <Nav />
      
      <DetailsModal />
      
      {/* Espaciador para evitar sobreposición con nav fijo */}
      <div style={{ height: '100px', width: '100%' }}></div>
      
      {/* Contenedor principal de productos */}
      <div className="products-container" style={{ marginTop: '120px' }}>
        <h2 className="category-title">Productos de la categoría</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img 
                src={product.images?.[0] || '/placeholder.png'} 
                alt={product.name} 
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description || "Sin descripción"}</p>
                <div className="price">
                  {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
                  <span className="new-price">${product.finalPrice || product.price}</span>
                </div>
              </div>
              <button 
                className="add-button"
                onClick={() => openDetailsModal(product)}
                title="Ver más detalles del producto"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CategoryProducts;