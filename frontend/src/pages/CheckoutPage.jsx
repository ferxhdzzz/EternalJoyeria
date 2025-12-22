// =======================
// CheckoutPage.jsx CORREGIDO
// =======================

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';
import Footer from '../components/Footer';
import usePayment from '../hooks/Payment/usePayment';

// ICONO universal de copiar estilo empresas
const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="black" strokeWidth="2" />
        <rect x="2" y="2" width="13" height="13" rx="2" stroke="black" strokeWidth="2" />
    </svg>
);

// Ticket Edge
const TicketEdge = () => (
    <svg width="100%" height="6" viewBox="0 0 400 6" fill="none">
        <g>
            {[...Array(20)].map((_, i) => (
                <circle key={i} cx={20 * i + 10} cy={-6} r={6} fill="#fceee7" />
            ))}
        </g>
    </svg>
);

// Progress Bar
const ProgressBar = ({ step }) => (
    <div className="progress-bar-container">
        <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <span>1</span><label>Datos</label>
            </div>

            <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>

            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <span>2</span><label>Pago</label>
            </div>

            <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>

            <div className={`progress-step ${step >= 3 ? 'active completed' : ''}`}>
                <span>{step >= 3 ? '✓' : '3'}</span><label>Confirmación</label>
            </div>
        </div>
    </div>
);

const CheckoutPage = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    // Extraemos las funciones con los nombres EXACTOS que devuelve tu usePayment.js
    const { 
        step, 
        formData, 
        handleChangeData, 
        errors,
        paymentMethod, 
        setPaymentMethod,
        showModal, 
        setShowModal,
        order,
        nextStep,
        previousStep,
        handlePay,
        handleNextFromModal,
        finishOrder
    } = usePayment();

    const [cartEmptyAtStart] = useState(cartItems.length === 0 && !order);
    const [cartOpen, setCartOpen] = useState(false);

    /* DATOS BANCO */
    const bankInfo = {
        banco: "Banco de América Central Credomatic",
        nombre: "ROXANA IVONNE RIVERA MARTINEZ",
        cuenta: "116439142",
        tipo: "Cuenta de ahorros",
    };

    const adminPaypalEmail = "roxanarivera20@gmail.com";

    const handleCopyText = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            icon: "success",
            title: "Copiado",
            showConfirmButton: false,
            timer: 900,
        });
    };

    // Función para manejar el botón final de redirección
    const handleFinish = () => {
        finishOrder(); // Limpia el estado en el hook
        navigate("/historial"); // Redirige al usuario
    };

    if (cartEmptyAtStart && step !== 3) {
        return (
            <>
                <Nav cartOpen={cartOpen} />
                <div className="checkout-page-container empty">
                    <h2>Tu carrito está vacío.</h2>
                </div>
                <Footer />
            </>
        );
    }

    const subtotal = order?.total || cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal;

    const itemsToShow = step === 3
        ? order?.item?.map(p => ({
            id: p.productId?._id || Math.random(),
            name: p.item?.name || "Producto",
            quantity: p.quantity,
            price: (p.unitPriceCents || 0) / 100,
            image: p.item?.images?.[0]
        }))
        : cartItems;

    return (
        <div className="checkout-page">
            <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <Nav cartOpen={cartOpen} />

            <div className="checkout-bg">
                <div className="checkout-flex">

                    {/* FORMULARIO */}
                    <section className="checkout-payment-box ticket-form-box">
                        <ProgressBar step={step} />

                        {/* STEP 1: Datos */}
                        {step === 1 && (
                            <>
                                <h2 className="ticket-title">Datos de envío</h2>
                                <form className="ticket-form">
                                    {[
                                        { key: "nombre", label: "Nombre Completo" },
                                        { key: "email", label: "Email" },
                                        { key: "telefono", label: "Teléfono" },
                                        { key: "direccion", label: "Dirección" },
                                        { key: "ciudad", label: "Ciudad / Departamento" },
                                        { key: "country", label: "País" },
                                    ].map((field) => (
                                        <div className="ticket-field" key={field.key}>
                                            <label>{field.label}</label>
                                            {field.key === "country" ? (
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChangeData}
                                                    className="ticket-input-select"
                                                >
                                                    <option value="">Seleccione una opción</option>
                                                    <option value="El Salvador">El Salvador</option>
                                                    <option value="Estados Unidos">Estados Unidos</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.key === 'email' ? 'email' : 'text'}
                                                    name={field.key}
                                                    value={formData[field.key]}
                                                    onChange={handleChangeData}
                                                />
                                            )}
                                            {errors[field.key] && (
                                                <span className="ticket-error">{errors[field.key]}</span>
                                            )}
                                        </div>
                                    ))}
                                    <button className="ticket-pay-btn" type="button" onClick={nextStep}>
                                        Siguiente →
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STEP 2: Pago */}
                        {step === 2 && (
                            <>
                                <h2 className="ticket-title">Métodos de pago</h2>
                                <div className="payment-grid-cute">
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "PayPal" ? "active" : ""}`}
                                        onClick={() => { setPaymentMethod("PayPal"); setShowModal("paypal"); }}
                                    >
                                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" />
                                        <span>PayPal</span>
                                    </button>

                                    <button
                                        className={`payment-card-cute ${paymentMethod === "Transferencia" ? "active" : ""}`}
                                        onClick={() => { setPaymentMethod("Transferencia"); setShowModal("transfer"); }}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Banco" />
                                        <span style={{ fontSize: "12px", fontWeight: "600" }}>Banco de América Central</span>
                                    </button>

                                    <button
                                        className={`payment-card-cute ${paymentMethod === "Link" ? "active" : ""}`}
                                        onClick={() => { setPaymentMethod("Link"); setShowModal("link"); }}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Link" />
                                        <span>Link de Pago</span>
                                    </button>
                                </div>

                                <div className="ticket-button-row">
                                    <button className="ticket-back-btn" onClick={previousStep}>← Volver</button>
                                    {paymentMethod && (
                                        <button className="ticket-pay-btn" onClick={handlePay}>
                                            Siguiente →
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* STEP 3: Confirmación */}
                        {step === 3 && (
                            <div className="ticket-success">
                                <div className="success-icon">✓</div>
                                <h2 className="ticket-title">¡Pedido registrado!</h2>
                                <p className="success-message">
                                    Tu orden <b>#{order?._id?.slice(-6).toUpperCase() || "N/A"}</b> fue registrada correctamente.
                                </p>
                                <p className="success-message">
                                    📧 Te enviamos un <b>correo con el resumen de tu compra</b>.  
                                    Si no lo ves, revisa tu carpeta de spam 💌
                                </p>
                                <button className="ticket-pay-btn" onClick={handleFinish}>
                                    Ver mis pedidos
                                </button>
                            </div>
                        )}
                    </section>

                    {/* RESUMEN (Derecha) */}
                    <section className="checkout-summary-box ticket-summary-box">
                        <TicketEdge />
                        <div className="ticket-summary-inner">
                            <h3 className="ticket-summary-title">Resumen</h3>
                            {itemsToShow?.map((item, idx) => (
                                <div className="ticket-summary-item" key={item.id || idx}>
                                    <img src={item.image} className="ticket-summary-img" alt={item.name} />
                                    <div className="ticket-summary-details">
                                        <span>{item.name} x {item.quantity}</span>
                                    </div>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="ticket-summary-row">
                                <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="ticket-summary-total-row">
                                <span>Total</span> <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <TicketEdge style={{ transform: "rotate(180deg)" }} />
                    </section>
                </div>
            </div>

            <Footer />

            {/* MODALES */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Modal Transferencia */}
                        {showModal === "transfer" && (
                            <>
                                <h2 className="modal-title">Datos Bancarios</h2>
                                <p className="modal-instruction">Realiza la transferencia por <b>${total.toFixed(2)}</b>:</p>
                                <div className="modal-info">
                                    <p><strong>Banco:</strong> {bankInfo.banco}</p>
                                    <p><strong>Nombre:</strong> {bankInfo.nombre}</p>
                                    <p><strong>Tipo:</strong> {bankInfo.tipo}</p>
                                    <p className="copy-row">
                                        <strong>N° Cuenta:</strong> {bankInfo.cuenta}
                                        <button className="copy-icon-btn" onClick={() => handleCopyText(bankInfo.cuenta)}><CopyIcon /></button>
                                    </p>
                                </div>
                                <button className="modal-btn next" onClick={handleNextFromModal}>Confirmar Pedido →</button>
                            </>
                        )}

                        {/* Modal Link */}
                        {showModal === "link" && (
                            <>
                                <h2 className="modal-title">Link de Pago</h2>
                                <p className="modal-instruction">Paga <b>${total.toFixed(2)}</b> en el siguiente enlace:</p>
                                <div className="copy-row">
                                    <span>https://tu-link-real.com</span>
                                    <button className="copy-icon-btn" onClick={() => handleCopyText("https://tu-link-real.com")}><CopyIcon /></button>
                                </div>
                                <a href="https://tu-link-real.com" target="_blank" rel="noopener noreferrer" className="payment-link">Ir al link de pago</a>
                                <button className="modal-btn next" onClick={handleNextFromModal}>Confirmar Pedido →</button>
                            </>
                        )}

                        {/* Modal PayPal */}
                        {showModal === "paypal" && (
                            <>
                                <h2 className="modal-title">Pago con PayPal</h2>
                                <p className="modal-instruction">Envía <b>${total.toFixed(2)}</b> al siguiente correo:</p>
                                <div className="copy-row">
                                    <span>{adminPaypalEmail}</span>
                                    <button className="copy-icon-btn" onClick={() => handleCopyText(adminPaypalEmail)}><CopyIcon /></button>
                                </div>
                                <button className="modal-btn next" onClick={handleNextFromModal}>Confirmar Pedido →</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;