import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';
import Footer from '../components/Footer';

// IMPORTAR EL HOOK DE PAGO
import usePayment from '../hooks/Payment/usePayment';

// ======================
// SVG Super cute (Se mantiene igual)
// ======================
const TicketEdge = () => (
    <svg width="100%" height="6" viewBox="0 0 400 6" fill="none">
        <g>
            {[...Array(20)].map((_, i) => (
                <circle key={i} cx={20 * i + 10} cy={-6} r={6} fill="#fceee7" />
            ))}
        </g>
    </svg>
);

// ======================
// Progress bar (Se mantiene igual)
// ======================
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
    // Usar el hook de Cart solo para el resumen/vaciar.
    const { cartItems } = useCart();
    const navigate = useNavigate();

    // 1. LLAMAR AL HOOK DE PAGO
    const { 
        step, setStep, 
        formData, handleChangeData, errors, 
        paymentMethod, setPaymentMethod, 
        showModal, setShowModal, 
        order, // El estado de la orden (del hook)
        nextStep: hookNextStep, // Renombrar para evitar conflicto
        previousStep: hookPreviousStep, // Renombrar para evitar conflicto
        handlePay: hookHandlePay, // Función principal de pago
        handleNextFromModal: hookHandleNextFromModal, // Función de modal de pago
        finishOrder: hookFinishOrder // Función para reiniciar estados
    } = usePayment();

    // FIX: Para evitar falso "carrito vacío"
    const [cartEmptyAtStart] = useState(cartItems.length === 0 && !order);

    const [cartOpen, setCartOpen] = useState(false);

    // ======================
    // BANK INFO (Se mantiene igual)
    // ======================
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

    // ======================
    // HANDLERS DEL FLUJO
    // ======================

    const nextStep = () => {
        hookNextStep();
    };

    const previousStep = () => {
        hookPreviousStep();
    };

    // Usar la función centralizada del hook
    const handlePay = () => {
        hookHandlePay();
    };

    // Usar la función centralizada del hook
    const handleNextFromModal = () => {
        hookHandleNextFromModal();
    };

    // Función para ir a historial y resetear el hook
    const finishOrder = () => {
        hookFinishOrder();
        navigate("/historial");
    };


    // ======================
    // FIX: Carrito vacío solo si fue vacío desde el principio (Usamos 'order' del hook)
    // ======================
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

    // ======================
    // UI
    // ======================
    // Usar el total del objeto 'order' del hook si existe, si no, calcular localmente.
    const subtotal = order?.total || cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal; // Asumiendo que subtotal === total por simplicidad

    // Items a mostrar: cartItems en pasos 1 y 2, y los productos de la order guardada en paso 3
    const itemsToShow = step === 3 ? order?.products?.map(p => ({
        // Adaptar al formato que usa tu UI
        id: p.productId._id, 
        name: p.productId.name, 
        quantity: p.quantity, 
        price: p.unitPriceCents / 100, // Asume que unitPriceCents es el precio unitario
        image: p.productId.images?.[0] // Asume que la imagen está en el subcampo
    })) : cartItems;


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
                                    {Object.keys(formData).map((key) => (
                                        <div className="ticket-field" key={key}>
                                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                            <input
                                                type="text"
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChangeData} // Usar el handler del hook
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

                        {/* STEP 2 */}
                        {step === 2 && (
                            <>
                                <h2 className="ticket-title">Métodos de pago</h2>

                                <div className="payment-grid-cute">

                                    {/* PAYPAL */}
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "PayPal" ? "active" : ""}`}
                                        onClick={() => setPaymentMethod("PayPal")}
                                    >
                                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" />
                                        <span>PayPal</span>
                                    </button>

                                    {/* TRANSFERENCIA */}
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "Transferencia" ? "active" : ""}`}
                                        onClick={() => {
                                            setPaymentMethod("Transferencia");
                                            setShowModal("transfer");
                                        }}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" />
                                        <span style={{ fontSize: "12px", fontWeight: "600" }}>Banco de América Central</span>
                                    </button>

                                    {/* LINK */}
                                    <button
                                        className={`payment-card-cute ${paymentMethod === "Link" ? "active" : ""}`}
                                        onClick={() => {
                                            setPaymentMethod("Link");
                                            setShowModal("link");
                                        }}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" />
                                        <span>Link de Pago</span>
                                    </button>
                                </div>

                                <div className="ticket-button-row">
                                    <button className="ticket-back-btn" onClick={previousStep}>
                                        ← Volver
                                    </button>

                                    {/* El botón ahora solo llama a handlePay, y este decide si abre modal o procede */}
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
                                    Recibirás un email de confirmación.
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

                            <div className="ticket-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="ticket-summary-total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
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

                        <button className="modal-close-btn" onClick={() => setShowModal(false)}>X</button>

                        {showModal === "transfer" && (
                            <>
                                <h2 className="modal-title">Datos Bancarios</h2>
                                <p className="modal-instruction">
                                    Realiza la transferencia por el total de <b>${total.toFixed(2)}</b> con los siguientes datos:
                                </p>

                                <div className="modal-info">
                                    <p><strong>Banco:</strong> {bankInfo.banco}</p>
                                    <p><strong>Nombre:</strong> {bankInfo.nombre}</p>
                                    <p><strong>Tipo:</strong> {bankInfo.tipo}</p>
                                    <p><strong>N° Cuenta:</strong> {bankInfo.cuenta}</p>
                                </div>

                                <button className="modal-btn copy" onClick={handleCopy}>Copiar número</button>
                                <button className="modal-btn next" onClick={handleNextFromModal}>
                                    Siguiente → Confirmar Pedido
                                </button>
                            </>
                        )}

                        {showModal === "link" && (
                            <>
                                <h2 className="modal-title">Link de Pago</h2>
                                <p className="modal-instruction">Serás redirigido a la pasarela de pago para completar la transacción de <b>${total.toFixed(2)}</b>:</p>

                                <a href="https://tu-link-real.com" target="_blank" className="payment-link">
                                    Ir al link
                                </a>

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