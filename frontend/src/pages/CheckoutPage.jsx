// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';
import Footer from '../components/Footer';

// SVG EDGE (Sin cambios)
const TicketEdge = () => (
  <svg width="100%" height="6" viewBox="0 0 400 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <g>
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={20 * i + 10} cy={-6} r={6} fill="#fceee7" />
      ))}
    </g>
  </svg>
);

// PROGRESS BAR (Sin cambios)
const ProgressBar = ({ step }) => (
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

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState(1);

  // MODALES
  const [showModal, setShowModal] = useState(false); // Puede ser false, "transfer", o "link"

  // DATOS MODAL
  const bankInfo = {
    banco: "Banco de América Central Credomatic",
    nombre: "Eternal Joyeria",
    cuenta: "0000-0000-0000-0000",
    tipo: "Cuenta de ahorros",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.cuenta);
    Swal.fire("Copiado", "Número de cuenta copiado.", "success");
  };

  // FORMULARIO - Inicializado a lo que se espera en el paso 1
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: ""
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");

  // TOTAL
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;
  
  // LOGICA SIMULADA DE ORDEN PENDIENTE
  const [order, setOrder] = useState(null);

  // VALIDACIÓN PASO 1 (Datos de envío)
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.direccion.trim()) newErrors.direccion = "Dirección requerida";
    if (!formData.ciudad.trim()) newErrors.ciudad = "Ciudad requerida";
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = "Código postal requerido";
    if (!formData.telefono.trim()) newErrors.telefono = "Teléfono requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowModal(false); // Asegura que el modal se cierre si vuelve al paso 1
    }
  };
  
  // Función que simula guardar la orden como Pendiente
  const createPendingOrder = (method) => {
    // Simulación: aquí se enviaría la data de formData, cartItems y el paymentMethod al backend.
    // El backend crearía una orden con estado 'PENDIENTE'
    console.log("Creando orden pendiente con método:", method, "y datos:", formData);
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cartItems,
        shipping: formData,
        paymentMethod: method,
        total: total,
        status: 'PENDIENTE', // El estado clave
    };
    
    // Simula guardar en el estado global/contexto de usuario.
    setOrder(newOrder); 
    
    // Limpia el carrito local
    clearCart();

    // Mueve al paso 3
    setStep(3);
    setShowModal(false); // Cierra el modal si estaba abierto
  };

  // En el Paso 2: Finalizar compra (usado cuando no hay modal)
  const handlePay = () => {
    if (!paymentMethod || paymentMethod === "PayPal") { // Si no es transferencia/link, finaliza la compra.
      if (!paymentMethod) {
         Swal.fire("Selecciona un método de pago", "", "warning");
         return;
      }
      Swal.fire({
          title: "Procesando pedido...",
          text: `Método: ${paymentMethod}. Tu pedido estará Pendiente de pago.`,
          icon: "info",
          timer: 1400,
          showConfirmButton: false,
      }).then(() => {
          createPendingOrder(paymentMethod);
      });
      
    } else {
        // Para Transferencia o Link, el flujo pasa por el modal.
        // Se define `paymentMethod` y luego el modal tiene el botón "Siguiente" que llama a `createPendingOrder`.
        // No se hace nada aquí directamente si se seleccionó Transferencia/Link.
        console.log(`Método ${paymentMethod} seleccionado. Esperando acción en el modal.`);
    }
  };
  
  // La función en el modal que ahora se llama "Siguiente"
  const handleNextFromModal = () => {
      // Simula el proceso de guardar la orden
      Swal.fire({
          title: "Generando pedido...",
          text: `Pedido en estado PENDIENTE con método: ${paymentMethod}`,
          icon: "info",
          timer: 1400,
          showConfirmButton: false,
      }).then(() => {
          createPendingOrder(paymentMethod);
      });
  };

  const finishOrder = () => navigate("/historial");

  // Si el carrito está vacío al iniciar
  if (cartItems.length === 0 && step !== 3) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        <div className="checkout-page-container empty">
          <h2>Tu carrito está vacío.</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="checkout-page">
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />

      <div className="checkout-bg">
        <div className="checkout-flex">

          {/* FORMULARIO */}
          <section className="checkout-payment-box ticket-form-box">
            <ProgressBar step={step} />

            {/* PASO 1 */}
            {step === 1 && (
              <>
                <h2 className="ticket-title">Datos de envío</h2>
                <form className="ticket-form">
                  {/* Se mapea como antes para simplificar */}
                  {Object.keys(formData).map((key) => (
                    <div className="ticket-field" key={key}>
                      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      />
                      {errors[key] && <span className="ticket-error">{errors[key]}</span>}
                    </div>
                  ))}
                  <button className="ticket-pay-btn" type="button" onClick={nextStep}>
                    Siguiente →
                  </button>
                </form>
              </>
            )}

            {/* PASO 2 — MÉTODOS DE PAGO */}
            {step === 2 && (
              <>
                <h2 className="ticket-title">Métodos de pago</h2>

                <div className="payment-grid-cute">

                  {/* PAYPAL (Finaliza directo) */}
                  <button
                    className={`payment-card-cute ${paymentMethod === "PayPal" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("PayPal")}
                  >
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal Logo" />
                    <span>PayPal</span>
                  </button>

                  {/* TRANSFERENCIA (Abre Modal, que tiene el botón Siguiente) */}
                  <button
                    className={`payment-card-cute ${paymentMethod === "Transferencia" ? "active" : ""}`}
                    onClick={() => {
                      setPaymentMethod("Transferencia");
                      setShowModal("transfer");
                    }}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Transferencia Logo" />
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>
                      Banco de América Central
                    </span>
                  </button>

                  {/* LINK (Abre Modal, que tiene el botón Siguiente) */}
                  <button
                    className={`payment-card-cute ${paymentMethod === "Link" ? "active" : ""}`}
                    onClick={() => {
                      setPaymentMethod("Link");
                      setShowModal("link");
                    }}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Link de Pago Logo" />
                    <span>Link de Pago</span>
                  </button>
                </div>

                <div className="ticket-button-row">
                  <button className="ticket-back-btn" onClick={previousStep}>
                    ← Volver
                  </button>
                  
                  {/* Botón de Finalizar solo disponible para métodos que no usan modal (ej: PayPal) */}
                  {paymentMethod && paymentMethod !== "Transferencia" && paymentMethod !== "Link" && (
                    <button className="ticket-pay-btn" onClick={handlePay}>
                        Finalizar compra
                    </button>
                  )}
                </div>
              </>
            )}

            {/* PASO 3 — CONFIRMACIÓN DE ORDEN PENDIENTE */}
            {step === 3 && (
              <div className="ticket-success">
                <div className="success-icon">✓</div>
                <h2 className="ticket-title">¡Pedido registrado!</h2>
                <p className="success-message">
                    Tu orden **#{order?.id || 'N/A'}** ha sido registrada y está en estado **PENDIENTE** de pago. 
                    <br/>Revisa la información que proporcionamos para completar tu pago.
                </p>
                <p className="success-small-text">
                    El administrador cambiará el estado a "Pagado" cuando confirme la transacción.
                </p>

                <button className="ticket-pay-btn" onClick={finishOrder}>
                  Ver mis pedidos
                </button>
              </div>
            )}
          </section>

          {/* RESUMEN */}
          <section className="checkout-summary-box ticket-summary-box">
            <TicketEdge />
            <div className="ticket-summary-inner">
              <h3 className="ticket-summary-title">Resumen de tu compra</h3>

              {/* Se usa `cartItems` o `order?.items` dependiendo del paso, pero usaremos `order?.items` para el paso 3 */}
              {(step === 3 ? (order?.items || []) : cartItems).map(item => (
                <div className="ticket-summary-item" key={item.id}>
                  <img src={item.image} className="ticket-summary-img" alt={item.name} />
                  <div className="ticket-summary-details">
                    <span className="ticket-summary-name">{item.name} x {item.quantity}</span>
                  </div>
                  <span className="ticket-summary-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="ticket-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="ticket-summary-total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <TicketEdge style={{ transform: "rotate(180deg)" }} />
          </section>
        </div>
      </div>

      <Footer />

      {/* 🌸 MODALES 🌸 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* Botón de cerrar (X) */}
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                X
            </button>

            {/* Transferencia */}
            {showModal === "transfer" && (
              <>
                <h2 className="modal-title">Datos Bancarios</h2>
                <p className="modal-instruction">Por favor, realiza la transferencia con los siguientes datos. Tu pedido se registrará como pendiente hasta que el administrador verifique el pago.</p>

                <div className="modal-info">
                  <p><strong>🏦 Banco:</strong> {bankInfo.banco}</p>
                  <p><strong>👤 Nombre:</strong> {bankInfo.nombre}</p>
                  <p><strong>🏷️ Tipo:</strong> {bankInfo.tipo}</p>
                  <p><strong>💳 N° Cuenta:</strong> {bankInfo.cuenta}</p>
                </div>

                <button className="modal-btn copy" onClick={handleCopy}>
                  Copiar número de cuenta
                </button>
                
                {/* BOTÓN MODIFICADO: De Cerrar a Siguiente */}
                <button className="modal-btn next" onClick={handleNextFromModal}>
                  Siguiente → Confirmar Pedido
                </button>
              </>
            )}

            {/* Link de Pago */}
            {showModal === "link" && (
              <>
                <h2 className="modal-title">Link de Pago</h2>
                <p className="modal-instruction">Serás redirigido a una página externa. Al regresar, tu pedido se registrará como pendiente hasta que el administrador verifique el pago.</p>
                <p>Puedes colocar tu link real aquí:</p>

                <a
                  href="https://tu-link-real.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="payment-link"
                >
                  Ir al link de pago
                </a>
                
                {/* BOTÓN MODIFICADO: De Cerrar a Siguiente */}
                <button className="modal-btn next" onClick={handleNextFromModal}>
                  Siguiente → Confirmar Pedido
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;