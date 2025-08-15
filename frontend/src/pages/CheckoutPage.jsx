import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';
import Footer from '../components/Footer';
import usePayment from '../hooks/Payment/usePayment.js'; // Importar el hook personalizado

const TicketEdge = () => (
  <svg width="100%" height="6" viewBox="0 0 400 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
    <g>
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={20 * i + 10} cy={-6} r={6} fill="#fceee7" />
      ))}
    </g>
  </svg>
);

// Componente de barra de progreso
const ProgressBar = ({ step }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <label>Datos de envío</label>
        </div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <label>Pago</label>
        </div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active completed' : ''}`}>
          <span>{step >= 3 ? '✓' : '3'}</span>
          <label>Confirmación</label>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  
  // Usar el hook personalizado
  const {
    formData,
    formDataTarjeta,
    handleChangeData,
    handleChangeTarjeta,
    handleFirstStep,
    handleFinishPayment,
    step,
    setStep,
    limpiarFormulario
  } = usePayment();

  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        <div className="checkout-page-container empty">
          <h2>Tu carrito está vacío.</h2>
          <p>No tienes productos para pagar.</p>
        </div>
      </>
    );
  }

  // Validar paso 1 (datos de envío)
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.direccion.trim()) newErrors.direccion = 'Dirección requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad requerida';
    if (!formData.codigoPostal.trim() || !/^\d{4,8}$/.test(formData.codigoPostal)) newErrors.codigoPostal = 'Código postal inválido (4-8 dígitos)';
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 2 (datos de tarjeta)
  const validateStep2 = () => {
    const newErrors = {};
    if (!formDataTarjeta.numeroTarjeta.trim() || !/^\d{13,16}$/.test(formDataTarjeta.numeroTarjeta.replace(/\s/g, ''))) {
      newErrors.numeroTarjeta = 'Tarjeta inválida (13-16 dígitos numéricos)';
    }
    if (!formDataTarjeta.mesVencimiento || !formDataTarjeta.anioVencimiento) {
      newErrors.fechaVencimiento = 'Fecha de vencimiento requerida';
    }
    if (!formDataTarjeta.cvv.trim() || !/^\d{3,4}$/.test(formDataTarjeta.cvv)) {
      newErrors.cvv = 'CVV inválido (3-4 dígitos)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Ir al siguiente paso
  const handleNextStep = async () => {
    if (step === 1) {
      if (validateStep1()) {
        // Actualizar monto basado en el carrito
        handleChangeData({
          target: { name: 'monto', value: (total * 100) / 100 } // Convertir a formato correcto
        });
        
        await handleFirstStep(); // Esto maneja el token y cambia el step
      }
    }
  };

  // Volver al paso anterior
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  // Procesar pago final
  const handlePay = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    try {
      await handleFinishPayment(); // Esto procesa el pago y maneja el resultado
      
      // Si llegamos aquí, el pago fue exitoso
      Swal.fire({
        title: "Pago exitoso",
        text: "Gracias por tu compra.",
        icon: "success",
        confirmButtonText: "Ver mis pedidos",
        confirmButtonColor: "#D1A6B4",
      }).then(() => {
        clearCart();
        navigate("/historial");
      });
    } catch (error) {
      console.error("Error al pagar:", error);
      Swal.fire({
        title: "Error inesperado",
        text: "No se pudo procesar el pago. Intenta de nuevo.",
        icon: "error",
      });
    }
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Manejar cambio en número de tarjeta con formato
  const handleCardNumberChange = (e) => {
    const rawValue = e.target.value.replace(/\s/g, ''); // Remover espacios para almacenamiento
    const formattedValue = formatCardNumber(e.target.value);
    
    // Actualizar con valor sin formato para el backend
    handleChangeTarjeta({
      target: { name: 'numeroTarjeta', value: rawValue }
    });
    
    // Mostrar valor formateado en el input
    e.target.value = formattedValue;
  };

  // Manejar cambio en fecha de vencimiento
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
    
    // Extraer mes y año
    const [mes, anio] = value.split('/');
    if (mes) {
      handleChangeTarjeta({ target: { name: 'mesVencimiento', value: mes } });
    }
    if (anio) {
      handleChangeTarjeta({ target: { name: 'anioVencimiento', value: `20${anio}` } });
    }
  };

  // Limpiar formulario y reiniciar
  const handleNewTransaction = () => {
    clearCart();
    limpiarFormulario();
    navigate("/historial");
  };

  return (
    <div className="checkout-page">
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      <div className="checkout-bg">
        <div className="checkout-flex">
          {/* Formulario de pasos */}
          <section className="checkout-payment-box ticket-form-box">
            <ProgressBar step={step} />
            
            {/* Paso 1: Datos de envío */}
            {step === 1 && (
              <>
                <h2 className="ticket-title">Datos de envío</h2>
                <form className="ticket-form">
                  <div className="ticket-field">
                    <label>Nombre completo</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre} 
                      onChange={handleChangeData} 
                    />
                    {errors.nombre && <span className="ticket-error">{errors.nombre}</span>}
                  </div>
                  <div className="ticket-field">
                    <label>Correo electrónico</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      onChange={handleChangeData} 
                    />
                    {errors.email && <span className="ticket-error">{errors.email}</span>}
                  </div>
                  <div className="ticket-field">
                    <label>Dirección</label>
                    <input 
                      type="text" 
                      name="direccion"
                      value={formData.direccion} 
                      onChange={handleChangeData} 
                    />
                    {errors.direccion && <span className="ticket-error">{errors.direccion}</span>}
                  </div>
                  <div className="ticket-field">
                    <label>Teléfono</label>
                    <input 
                      type="text" 
                      name="telefono"
                      value={formData.telefono} 
                      onChange={handleChangeData} 
                    />
                    {errors.telefono && <span className="ticket-error">{errors.telefono}</span>}
                  </div>
                  <div className="ticket-field-row">
                    <div className="ticket-field">
                      <label>Ciudad</label>
                      <input 
                        type="text" 
                        name="ciudad"
                        value={formData.ciudad} 
                        onChange={handleChangeData} 
                      />
                      {errors.ciudad && <span className="ticket-error">{errors.ciudad}</span>}
                    </div>
                    <div className="ticket-field">
                      <label>Código postal</label>
                      <input 
                        type="text" 
                        name="codigoPostal"
                        value={formData.codigoPostal} 
                        onChange={handleChangeData} 
                      />
                      {errors.codigoPostal && <span className="ticket-error">{errors.codigoPostal}</span>}
                    </div>
                  </div>
                  <button 
                    className="ticket-pay-btn" 
                    type="button"
                    onClick={handleNextStep}
                  >
                    Siguiente →
                  </button>
                </form>
              </>
            )}

            {/* Paso 2: Datos de tarjeta */}
            {step === 2 && (
              <>
                <h2 className="ticket-title">Información de pago</h2>
                <form className="ticket-form" onSubmit={handlePay}>
                  <div className="ticket-field">
                    <label>Número de tarjeta</label>
                    <input 
                      type="text" 
                      onChange={handleCardNumberChange} 
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.numeroTarjeta && <span className="ticket-error">{errors.numeroTarjeta}</span>}
                  </div>
                  <div className="ticket-field-row">
                    <div className="ticket-field">
                      <label>Fecha de vencimiento (MM/AA)</label>
                      <input 
                        type="text" 
                        onChange={handleExpiryChange} 
                        maxLength={5} 
                        placeholder="MM/AA" 
                      />
                      {errors.fechaVencimiento && <span className="ticket-error">{errors.fechaVencimiento}</span>}
                    </div>
                    <div className="ticket-field">
                      <label>Código de seguridad (CVV)</label>
                      <input 
                        type="text" 
                        name="cvv"
                        value={formDataTarjeta.cvv} 
                        onChange={handleChangeTarjeta} 
                        maxLength={4} 
                      />
                      {errors.cvv && <span className="ticket-error">{errors.cvv}</span>}
                    </div>
                  </div>
                  <div className="ticket-button-row">
                    <button 
                      className="ticket-back-btn" 
                      type="button"
                      onClick={handlePreviousStep}
                    >
                      ← Volver
                    </button>
                    <button className="ticket-pay-btn" type="submit">
                      Pagar ahora
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Paso 3: Confirmación */}
            {step === 3 && (
              <div className="ticket-success">
                <div className="success-icon">✓</div>
                <h2 className="ticket-title">¡Pago exitoso!</h2>
                <p className="success-message">
                  Tu transacción ha sido procesada correctamente
                </p>
                <div className="success-amount">
                  Monto procesado: ${total.toFixed(2)}
                </div>
                <button 
                  className="ticket-pay-btn" 
                  onClick={handleNewTransaction}
                >
                  Ver mis pedidos
                </button>
              </div>
            )}
          </section>

          {/* Ticket resumen */}
          <section className="checkout-summary-box ticket-summary-box">
            <TicketEdge />
            <div className="ticket-summary-inner">
              <h3 className="ticket-summary-title">Resumen de tu compra</h3>
              <div className="ticket-summary-items">
                {cartItems.map(item => (
                  <div className="ticket-summary-item" key={item.id + '-' + item.size}>
                    <img src={item.image} alt={item.name} className="ticket-summary-img" />
                    <div className="ticket-summary-details">
                      <span className="ticket-summary-name">{item.name}</span>
                      <span className="ticket-summary-size">Talla: {item.size}</span>
                    </div>
                    <span className="ticket-summary-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="ticket-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="ticket-summary-row">
                <span>Envío</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="ticket-summary-total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <TicketEdge style={{ transform: 'rotate(180deg)' }} />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;