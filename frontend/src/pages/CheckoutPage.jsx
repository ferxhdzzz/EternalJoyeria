// src/pages/CheckoutPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import SidebarCart from "../components/Cart/SidebarCart";
import Footer from "../components/Footer";
import usePayment from "../hooks/Payment/usePayment";
import "../styles/CheckoutPage.css";

// SVG EDGE
const TicketEdge = () => (
  <svg width="100%" height="6" viewBox="0 0 400 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <g>
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={20 * i + 10} cy={-6} r={6} fill="#fceee7" />
      ))}
    </g>
  </svg>
);

// PROGRESS BAR (sin cambios)
const ProgressBar = ({ step }) => (
  <div className="progress-bar-container">
    <div className="progress-bar">
      <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
        <span>1</span>
        <label>Datos de envío</label>
      </div>
      <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>

      <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
        <span>2</span>
        <label>Pago</label>
      </div>

      <div className={`progress-line ${step >= 3 ? "active" : ""}`}></div>

      <div className={`progress-step ${step >= 3 ? "active completed" : ""}`}>
        <span>{step >= 3 ? "✓" : "3"}</span>
        <label>Confirmación</label>
      </div>
    </div>
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    // UI / pasos
    step,
    nextStep,
    previousStep,

    // form
    formData,
    handleChangeData,
    errors,

    // cart/order
    order,
    // metodo/modal
    paymentMethod,
    setPaymentMethod,
    showModal,
    setShowModal,

    // acciones
    handlePay,
    handleNextFromModal,
    finishOrder,
    // resumen
    syncCartItems,
    // carrito context (solo para leer items) -> loadOrCreateCart set order initially
    orderId,
  } = usePayment();

  // Para mostrar items usamos order?.products (si existe) o order?.items en fallback
  const itemsToShow = (step === 3 ? (order?.items || order?.products || []) : (order?.products || []));

  const subtotal = (itemsToShow || []).reduce((acc, it) => {
    // cada item puede tener subtotalCents or subtotal or unitPriceCents
    const unit = (it?.unitPriceCents ? it.unitPriceCents / 100 : it?.productId?.finalPrice ?? it?.productId?.price ?? it?.subtotal ?? 0);
    const qty = it?.quantity || it?.quantity || 1;
    // if unit is in cents handled above; but fallback:
    const val = (it?.subtotalCents ? it.subtotalCents / 100 : it?.subtotal ? it.subtotal : unit * qty);
    return acc + Number(val || 0);
  }, 0);

  const total = subtotal;

  // Si carrito vacío y no estamos en confirmación -> mostrar vacío
  if ((!itemsToShow || itemsToShow.length === 0) && step !== 3) {
    return (
      <>
        <SidebarCart isOpen={false} onClose={() => {}} />
        <Nav cartOpen={false} />
        <div className="checkout-page-container empty">
          <h2>Tu carrito está vacío.</h2>
        </div>
        <Footer />
      </>
    );
  }

  // Copiar número de cuenta desde el modal: el hook no trae banco, lo mantenemos simple aquí
  const bankInfo = {
    banco: "Banco de América Central Credomatic",
    nombre: "Eternal Joyeria",
    cuenta: "0000-0000-0000-0000",
    tipo: "Cuenta de ahorros",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.cuenta);
  };

  const onSelectPayment = (method) => {
    setPaymentMethod(method);
    if (method === "Transferencia") setShowModal("transfer");
    else if (method === "Link") setShowModal("link");
    else setShowModal(false);
  };

  const onFinishPayClick = async () => {
    try {
      await handlePay({ openModalIfNeeded: true });
    } catch (err) {
      // errores ya manejados en hook (Swal)
    }
  };

  const onModalNext = async () => {
    try {
      await handleNextFromModal();
    } catch (err) {
      // ya manejado
    }
  };

  const finishOrderNavigate = () => {
    finishOrder();
    navigate("/historial");
  };

  return (
    <div className="checkout-page">
      <SidebarCart isOpen={false} onClose={() => {}} />
      <Nav cartOpen={false} />

      <div className="checkout-bg">
        <div className="checkout-flex">
          {/* FORMULARIO */}
          <section className="checkout-payment-box ticket-form-box">
            <ProgressBar step={step} />

            {/* PASO 1 */}
            {step === 1 && (
              <>
                <h2 className="ticket-title">Datos de envío</h2>
                <form className="ticket-form" onSubmit={(e) => e.preventDefault()}>
                  {Object.keys(formData).map((key) => (
                    <div className="ticket-field" key={key}>
                      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={(e) => handleChangeData(e)}
                        placeholder={key}
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
                  <button
                    className={`payment-card-cute ${paymentMethod === "PayPal" ? "active" : ""}`}
                    onClick={() => onSelectPayment("PayPal")}
                  >
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal Logo" />
                    <span>PayPal</span>
                  </button>

                  <button
                    className={`payment-card-cute ${paymentMethod === "Transferencia" ? "active" : ""}`}
                    onClick={() => onSelectPayment("Transferencia")}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/565/565547.png" alt="Transferencia" />
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>Banco de América Central</span>
                  </button>

                  <button
                    className={`payment-card-cute ${paymentMethod === "Link" ? "active" : ""}`}
                    onClick={() => onSelectPayment("Link")}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Link de Pago" />
                    <span>Link de Pago</span>
                  </button>
                </div>

                <div className="ticket-button-row">
                  <button className="ticket-back-btn" onClick={previousStep}>← Volver</button>

                  {/* Finalizar compra solo si es PayPal (o cualquier método "directo") */}
                  {paymentMethod && paymentMethod !== "Transferencia" && paymentMethod !== "Link" && (
                    <button className="ticket-pay-btn" onClick={onFinishPayClick}>Finalizar compra</button>
                  )}
                </div>
              </>
            )}

            {/* PASO 3 — CONFIRMACIÓN */}
            {step === 3 && (
              <div className="ticket-success">
                <div className="success-icon">✓</div>
                <h2 className="ticket-title">¡Pedido registrado!</h2>
                <p className="success-message">
                  Tu orden **#{order?._id || order?.id || "N/A"}** ha sido registrada y está en estado <strong>PENDIENTE</strong> de pago.
                </p>
                <p className="success-small-text">El administrador cambiará el estado a "Pagado" cuando confirme la transacción.</p>

                <button className="ticket-pay-btn" onClick={finishOrderNavigate}>Ver mis pedidos</button>
              </div>
            )}
          </section>

          {/* RESUMEN */}
          <section className="checkout-summary-box ticket-summary-box">
            <TicketEdge />
            <div className="ticket-summary-inner">
              <h3 className="ticket-summary-title">Resumen de tu compra</h3>

              {(itemsToShow || []).map((raw, idx) => {
                // Adaptar distintos formatos de item
                const item = raw.productId ? {
                  id: raw.productId._id || raw.productId,
                  image: (raw.productId?.images && raw.productId.images[0]) || raw.image || 'https://placehold.co/150x150',
                  name: raw.productId?.name || raw.name || "Producto",
                  price: (raw.unitPriceCents ? raw.unitPriceCents/100 : raw.productId?.finalPrice ?? raw.productId?.price ?? raw.price ?? raw.subtotal ?? 0),
                  quantity: raw.quantity || 1
                } : {
                  id: raw.id || raw._id || idx,
                  image: raw.image || 'https://placehold.co/150x150',
                  name: raw.name || "Producto",
                  price: raw.price || 0,
                  quantity: raw.quantity || 1
                };

                return (
                  <div className="ticket-summary-item" key={item.id || idx}>
                    <img src={item.image} className="ticket-summary-img" alt={item.name} />
                    <div className="ticket-summary-details">
                      <span className="ticket-summary-name">{item.name} x {item.quantity}</span>
                    </div>
                    <span className="ticket-summary-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}

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

      {/* MODALES */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>X</button>

            {showModal === "transfer" && (
              <>
                <h2 className="modal-title">Datos Bancarios</h2>
                <p className="modal-instruction">Realiza la transferencia con los siguientes datos. Tu pedido se registrará como pendiente hasta que el administrador verifique el pago.</p>
                <div className="modal-info">
                  <p><strong>🏦 Banco:</strong> {bankInfo.banco}</p>
                  <p><strong>👤 Nombre:</strong> {bankInfo.nombre}</p>
                  <p><strong>🏷️ Tipo:</strong> {bankInfo.tipo}</p>
                  <p><strong>💳 N° Cuenta:</strong> {bankInfo.cuenta}</p>
                </div>
                <button className="modal-btn copy" onClick={handleCopy}>Copiar número de cuenta</button>
                <button className="modal-btn next" onClick={onModalNext}>Siguiente → Confirmar Pedido</button>
              </>
            )}

            {showModal === "link" && (
              <>
                <h2 className="modal-title">Link de Pago</h2>
                <p className="modal-instruction">Serás redirigido a una página externa. Al regresar, tu pedido se registrará como pendiente.</p>

                <a
                  href="https://tu-link-real.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="payment-link"
                >
                  Ir al link de pago
                </a>

                <button className="modal-btn next" onClick={onModalNext}>Siguiente → Confirmar Pedido</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
