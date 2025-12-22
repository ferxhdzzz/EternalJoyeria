// =======================
// CheckoutPage.jsx COMPLETO
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

    const { 
        step, setStep,
        formData, handleChangeData, errors,
        paymentMethod, setPaymentMethod,
        showModal, setShowModal,
        order,
        nextStep: hookNextStep,
        previousStep: hookPreviousStep,
        handlePay: hookHandlePay,
        handleNextFromModal: hookHandleNextFromModal,
        finishOrder: hookFinishOrder
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

    const nextStep = () => hookNextStep();
    const previousStep = () => hookPreviousStep();
    const handlePay = () => hookHandlePay();
    const handleNextFromModal = () => hookHandleNextFromModal();
    const finishOrder = () => {
        hookFinishOrder();
        navigate("/historial");
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
   const shipping = 3.00;

    const total = subtotal + shipping;
      
    const itemsToShow = step === 3
        ? order?.products?.map(p => ({
            id: p.productId._id,
            name: p.productId.name,
            quantity: p.quantity,
            price: p.unitPriceCents / 100,
            image: p.productId.images?.[0]
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

                        {/* STEP 1 */}
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
                                        { key: "country", label: "País" }, // SELECT
                                    ].map((field) => (

                                        field.key === "country" ? (
                                            // ⭐ SELECT PARA PAÍS
                                            <div className="ticket-field" key={field.key}>
                                                <label>{field.label}</label>

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

                                                {errors[field.key] && (
                                                    <span className="ticket-error">{errors[field.key]}</span>
                                                )}
                                            </div>
                                        ) : (

                                            <div className="ticket-field" key={field.key}>
                                                <label>{field.label}</label>

                                                <input
                                                    type={field.key === 'email' ? 'email' : 'text'}
                                                    name={field.key}
                                                    value={formData[field.key]}
                                                    onChange={handleChangeData}
                                                />

                                                {errors[field.key] && (
                                                    <span className="ticket-error">{errors[field.key]}</span>
                                                )}
                                            </div>

                                        )

                                    ))}

                                    <button className="ticket-pay-btn" type="button" onClick={nextStep}>
                                        Siguiente →
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <>
                                <h2 className="ticket-title">Métodos de pago</h2>

                                <div className="payment-grid-cute">

                                    {/* PAYPAL */}
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "PayPal" ? "active" : ""}`}
                                        onClick={() => { setPaymentMethod("PayPal"); setShowModal("paypal"); }}
                                    >
                                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" />
                                        <span>PayPal</span>
                                    </button>

                                    {/* TRANSFERENCIA */}
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "Transferencia" ? "active" : ""}`}
                                        onClick={() => { setPaymentMethod("Transferencia"); setShowModal("transfer"); }}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" />
                                        <span style={{ fontSize: "12px", fontWeight: "600" }}>
                                            Banco de América Central
                                        </span>
                                    </button>

                                    {/* LINK */}
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "Link" ? "active" : ""}`}
                                        onClick={() => { setPaymentMethod("Link"); setShowModal("link"); }}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" />
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

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="ticket-success">
                                <div className="success-icon">✓</div>
                                <h2 className="ticket-title">¡Pedido registrado!</h2>

                                <p className="success-message">
                                    Tu orden <b>#{order?._id.slice(-6).toUpperCase()}</b> fue registrada como <b>PENDIENTE</b>.
                                </p>

   <p className="success-message">
                                  Te hemos enviado un <b>correo</b> si no lo ves revisa tu bandeja pricipal revisa en la bandeja de  <b>spam</b>.
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
                            <h3 className="ticket-summary-title">Resumen</h3>

                            {itemsToShow?.map(item => (
                                <div className="ticket-summary-item" key={item.id}>
                                    <img src={item.image} className="ticket-summary-img" />
                                    <div className="ticket-summary-details">
                                        <span>{item.name} x {item.quantity}</span>
                                    </div>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}

                            <div className="ticket-summary-row">
                                <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>

                            </div>
                                <div className="ticket-summary-row">
                                <span>Envio</span> <span>${shipping.toFixed(2)}</span>
                                
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

                        {/* TRANSFERENCIA */}
                        {showModal === "transfer" && (
                            <>
                                <h2 className="modal-title">Datos Bancarios</h2>

                                <p className="modal-instruction">
                                    Realiza la transferencia por un total de <b>${total.toFixed(2)}</b>:
                                </p>

                                <div className="modal-info">
                                    <p><strong>Banco:</strong> {bankInfo.banco}</p>
                                    <p><strong>Nombre:</strong> {bankInfo.nombre}</p>
                                    <p><strong>Tipo:</strong> {bankInfo.tipo}</p>

                                    <p className="copy-row">
                                        <strong>N° Cuenta:</strong> {bankInfo.cuenta}
                                        <button
                                            className="copy-icon-btn"
                                            onClick={() => handleCopyText(bankInfo.cuenta)}
                                        >
                                            <CopyIcon />
                                        </button>
                                    </p>
                                </div>

                                <button className="modal-btn next" onClick={handleNextFromModal}>
                                    Siguiente → Confirmar Pedido
                                </button>
                            </>
                        )}

                        {/* LINK */}
                        {showModal === "link" && (
                            <>
                                <h2 className="modal-title">Link de Pago</h2>

                                <p className="modal-instruction">
                                    Serás redirigido a la pasarela por <b>${total.toFixed(2)}</b>.
                                </p>

                                <div className="copy-row">
                                    <span>https://tu-link-real.com</span>
                                    <button
                                        className="copy-icon-btn"
                                        onClick={() => handleCopyText("https://tu-link-real.com")}
                                    >
                                        <CopyIcon />
                                    </button>
                                </div>

                                <a href="https://tu-link-real.com" target="_blank" className="payment-link">
                                    Ir al link de pago
                                </a>

                                <button className="modal-btn next" onClick={handleNextFromModal}>
                                    Siguiente → Confirmar Pedido
                                </button>
                            </>
                        )}

                        {/* PAYPAL */}
                        {showModal === "paypal" && (
                            <>
                                <h2 className="modal-title">Pago con PayPal</h2>

                                <p className="modal-instruction">
                                    Este es el <b>correo PayPal</b> donde debes enviar tu pago por <b>${total.toFixed(2)}</b>.
                                </p>

                                <div className="copy-row">
                                    <span>{adminPaypalEmail}</span>
                                    <button
                                        className="copy-icon-btn"
                                        onClick={() => handleCopyText(adminPaypalEmail)}
                                    >
                                        <CopyIcon />
                                    </button>
                                </div>

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
