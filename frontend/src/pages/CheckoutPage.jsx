import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';
import Footer from '../components/Footer';

const TicketEdge = () => (
  <svg width="100%" height="6" viewBox="0 0 400 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
    {/* <rect width="400" height="24" fill="#fff"/> */}
    <g>
      {[...Array(20)].map((_,i) => (
        <circle key={i} cx={20*i+10} cy={-6} r={6} fill="#fceee7" />
      ))}
    </g>
  </svg>
);

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [payment, setPayment] = useState('card');
  const [card, setCard] = useState('');
  const [errors, setErrors] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

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

  const handlePay = (e) => {
    e.preventDefault();
    // Validación mejorada
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Nombre requerido';
    if (!email.trim()) newErrors.email = 'Correo requerido';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Correo inválido';
    if (!address.trim()) newErrors.address = 'Dirección requerida';
    if (!city.trim()) newErrors.city = 'Ciudad requerida';
    if (!zip.trim()) newErrors.zip = 'Código postal requerido';
    else if (!/^\d{4,8}$/.test(zip)) newErrors.zip = 'Código postal inválido (4-8 dígitos)';
    if (payment === 'card') {
      if (!card.trim()) newErrors.card = 'Número de tarjeta requerido';
      else if (!/^\d{13,16}$/.test(card)) newErrors.card = 'Tarjeta inválida (13-16 dígitos numéricos)';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    Swal.fire({
      title: '¡Gracias por tu compra!',
      text: 'Tu pedido ha sido procesado con éxito.',
      icon: 'success',
      confirmButtonText: 'Ver mis pedidos',
      confirmButtonColor: '#D1A6B4',
    }).then(() => {
      clearCart();
      navigate('/historial');
    });
  };

  return (
    <div className="checkout-page">
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      <div className="checkout-bg">
        <div className="checkout-flex">
          {/* Formulario de datos */}
          <section className="checkout-payment-box ticket-form-box">
            <h2 className="ticket-title">Datos de envío</h2>
            <form className="ticket-form" onSubmit={handlePay}>
              <div className="ticket-field">
                <label>Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                {errors.name && <span className="ticket-error">{errors.name}</span>}
              </div>
              <div className="ticket-field">
                <label>Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                {errors.email && <span className="ticket-error">{errors.email}</span>}
              </div>
              <div className="ticket-field">
                <label>Dirección</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                {errors.address && <span className="ticket-error">{errors.address}</span>}
              </div>
              <div className="ticket-field-row">
                <div className="ticket-field">
                  <label>Ciudad</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} />
                  {errors.city && <span className="ticket-error">{errors.city}</span>}
                </div>
                <div className="ticket-field">
                  <label>Código postal</label>
                  <input type="text" value={zip} onChange={e => setZip(e.target.value)} />
                  {errors.zip && <span className="ticket-error">{errors.zip}</span>}
                </div>
              </div>
              <div className="ticket-field">
                <label>Método de pago</label>
                <select value={payment} onChange={e => setPayment(e.target.value)}>
                  <option value="card">Tarjeta de crédito/débito</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              {payment === 'card' && (
                <div className="ticket-field">
                  <label>Número de tarjeta</label>
                  <input type="text" value={card} onChange={e => setCard(e.target.value)} maxLength={16} />
                  {errors.card && <span className="ticket-error">{errors.card}</span>}
                </div>
              )}
              <button className="ticket-pay-btn" type="submit">Pagar ahora</button>
            </form>
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
            <TicketEdge style={{transform:'rotate(180deg)'}} />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
