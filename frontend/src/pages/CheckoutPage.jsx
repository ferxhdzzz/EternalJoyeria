// src/pages/CheckoutPage.jsx

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';
import Footer from '../components/Footer';
// 🔑 Importamos el hook de pago modificado
import usePayment from '../hooks/Payment/usePayment'; 


// SVG EDGE (Sin cambios)
const TicketEdge = () => (
// ... (Componente igual)
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
// ... (Componente igual)
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
    
    // 🔑 Usamos el hook y obtenemos las funciones necesarias
    const { 
        formData, 
        handleChangeData, 
        step, 
        setStep, 
        order,
        loadOrCreateCart,
        syncCartItems,
        handleFirstStep,   // Usado para validar paso 1 y pasar al 2
        handleManualPayment // 🔑 Usado para finalizar la orden como PENDIENTE
    } = usePayment(); 
    
    // Estados locales para el flujo (igual que antes)
    const [showModal, setShowModal] = useState(false); 
    const [paymentMethod, setPaymentMethod] = useState("");
    const [errors, setErrors] = useState({});

    // DATOS MODAL (Igual que antes)
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

    // TOTAL (Igual que antes)
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    // VALIDACIÓN PASO 1 (Igual que antes)
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
    
    // 🔑 Transición al paso 2 (Usando la función del hook)
    const nextStep = async () => {
        if (step === 1 && validateStep1()) {
            try {
                // Guarda la dirección en la orden y pasa a setStep(2) dentro de handleFirstStep
                await handleFirstStep(); 
            } catch (error) {
                console.error("Error al guardar la dirección:", error);
                Swal.fire("Error", error.message || "No se pudo guardar la dirección.", "error");
            }
        }
    };

    const previousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setShowModal(false);
        }
    };
    
    // 🔑 Lógica para finalizar la orden como PENDIENTE
    const finalizePendingOrder = async (method) => {
        try {
            Swal.fire({
                title: "Registrando pedido...",
                text: `Finalizando orden con método ${method}.`,
                icon: "info",
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            
            // 🔑 Llama a la función del hook que gestiona la orden
            await handleManualPayment(method); 
            
            // Si tiene éxito, el hook ya habrá llamado a setStep(3)
            clearCart(); // Vacia el carrito local después de la confirmación del servidor
            setShowModal(false);
            Swal.close();
            
        } catch (error) {
            console.error('Error al finalizar la orden como pendiente:', error);
            Swal.fire("Error", error.message || "No se pudo finalizar la orden. Intenta de nuevo.", "error");
        }
    }


    // Llamado por el botón "Finalizar compra" (ej. PayPal)
    const handlePay = () => {
        if (!paymentMethod) {
            Swal.fire("Selecciona un método de pago", "", "warning");
            return;
        }
        // Ejecuta la creación de la orden pendiente a través del hook
        finalizePendingOrder(paymentMethod);
    };

    // Llamado por el botón "Siguiente → Confirmar Pedido" en los Modales (Transferencia/Link)
    const handleNextFromModal = () => {
        // Ejecuta la creación de la orden pendiente a través del hook
        finalizePendingOrder(paymentMethod);
    };

    const finishOrder = () => navigate("/historial");

    // Lógica para cargar/sincronizar el carrito al entrar a Checkout (Opcional, pero bueno si el hook lo requiere)
    // useEffect(() => {
    //     if (cartItems.length > 0) {
    //         loadOrCreateCart().catch(console.error);
    //     }
    // }, [loadOrCreateCart, cartItems.length]);
    
    // useEffect(() => {
    //     if (order?.status === 'cart') {
    //         syncCartItems(cartItems, { shippingCents: 0, taxCents: 0, discountCents: 0 }).catch(console.error);
    //     }
    // }, [cartItems, order?.status, syncCartItems]);


    // Manejo de carrito vacío (Igual que antes)
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

    // ===============================================
    // RENDERIZADO
    // ===============================================
    
    return (
        <div className="checkout-page">
            {/* ... (Nav, SidebarCart, Footer) */}

            <div className="checkout-bg">
                <div className="checkout-flex">

                    {/* FORMULARIO */}
                    <section className="checkout-payment-box ticket-form-box">
                        <ProgressBar step={step} />

                        {/* PASO 1 (Datos de envío) */}
                        {step === 1 && (
                            <>
                                <h2 className="ticket-title">Datos de envío</h2>
                                <form className="ticket-form">
                                  {/* Mapeo de campos */}
                                  {Object.keys(formData).filter(k => k !== 'apellido' && k !== 'idPais' && k !== 'idRegion').map((key) => (
                                    <div className="ticket-field" key={key}>
                                      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                      <input
                                        type="text"
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChangeData} // 🔑 Usamos la función del hook
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

                        {/* PASO 2 (Métodos de pago) */}
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

                                    {/* TRANSFERENCIA (Abre Modal) */}
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

                                    {/* LINK (Abre Modal) */}
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

                                    {/* Botón de Finalizar solo disponible para métodos que NO usan modal */}
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
                                    Tu orden **#{order?._id || 'N/A'}** ha sido registrada y está en estado **PENDIENTE** de pago. 
                                    <br />Revisa la información que proporcionamos para completar tu pago.
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

                    {/* RESUMEN (Usa order?.items para el paso 3) */}
                    <section className="checkout-summary-box ticket-summary-box">
                        <TicketEdge />
                        <div className="ticket-summary-inner">
                            <h3 className="ticket-summary-title">Resumen de tu compra</h3>

                            {/* Mostrar items del carrito o de la orden guardada */}
                            {(step === 3 ? (order?.items || []) : cartItems).map(item => (
                                <div className="ticket-summary-item" key={item._id || item.id}>
                                    <img src={item.image || item.product?.images?.[0] || 'placeholder.jpg'} className="ticket-summary-img" alt={item.name} />
                                    <div className="ticket-summary-details">
                                        <span className="ticket-summary-name">{item.name || item.product?.name} x {item.quantity}</span>
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
                                {/* ... (Modal info) */}
                                <button className="modal-btn copy" onClick={handleCopy}>
                                    Copiar número de cuenta
                                </button>
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
                                {/* ... (Modal link) */}
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