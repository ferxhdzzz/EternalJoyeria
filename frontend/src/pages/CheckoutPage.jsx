import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Swal from 'sweetalert2';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState({});

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const validate = () => {
    const newErrors = {};
    // Nombre
    if (!cardName.trim()) {
      newErrors.cardName = 'El nombre es obligatorio.';
    } else if (!/^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+)$/.test(cardName.trim())) {
      newErrors.cardName = 'Solo letras y espacios.';
    }
    // Número de tarjeta
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Debe tener 16 dígitos.';
    } else if (!luhnCheck(cardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido.';
    }
    // Fecha de vencimiento
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Formato inválido (MM/AA).';
    } else {
      const [mes, anio] = expiry.split('/');
      const now = new Date();
      const inputDate = new Date(`20${anio}`, mes - 1);
      if (inputDate < new Date(now.getFullYear(), now.getMonth())) {
        newErrors.expiry = 'La tarjeta está vencida.';
      }
    }
    // CVC
    if (!/^\d{3,4}$/.test(cvc)) {
      newErrors.cvc = 'CVC inválido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Algoritmo de Luhn para tarjetas
  function luhnCheck(num) {
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
    let lastDigit = arr.shift();
    let sum = arr.reduce(
      (acc, val, i) =>
        i % 2 === 0
          ? acc + ((val *= 2) > 9 ? val - 9 : val)
          : acc + val,
      0
    );
    sum += lastDigit;
    return sum % 10 === 0;
  }

  const handleCompletePayment = (e) => {
    e.preventDefault();
    if (!validate()) return;
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

  if (cartItems.length === 0) {
    return (
      <>
        <Nav />
        <div className="checkout-page-container empty">
          <h2>Tu carrito está vacío.</h2>
          <p>No tienes productos para pagar.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="checkout-bg">
        <div className="checkout-flex">
          {/* Payment Method Section */}
          <section className="checkout-payment-box">
            <div className="checkout-payment-header">
              <span className="checkout-payment-title">Método de pago</span>
              <span className="checkout-payment-secure">
                <img src="/lock.png" alt="Seguro" className="lock-icon" /> Seguro y cifrado
              </span>
            </div>
            <form className="checkout-form" onSubmit={handleCompletePayment}>
              <div className="checkout-tabs">
                <label className={`checkout-tab ${paymentMethod === 'creditCard' ? 'active' : ''}`}> 
                  <input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={() => setPaymentMethod('creditCard')} />
                  <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                    Tarjeta de crédito/débito
                    <span className="checkout-logos">
                      <img src="/mastercard.png" alt="Mastercard" className="logo-card" />
                      <img src="/visa.svg" alt="Visa" className="logo-card" />
                    </span>
                  </span>
                </label>
                <label className={`checkout-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}> 
                  <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                    PayPal
                    <img src="/paypal.png" alt="PayPal" className="paypal-logo" />
                  </span>
                </label>
              </div>
              {paymentMethod === 'creditCard' && (
                <div className="checkout-fields">
                  <div className="checkout-field">
                    <label>Nombre en la tarjeta</label>
                    <input
                      type="text"
                      placeholder="Nombre de la tarjeta"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      required
                    />
                    {errors.cardName && <span className="checkout-error">{errors.cardName}</span>}
                  </div>
                  <div className="checkout-field">
                    <label>Número de la tarjeta</label>
                    <input
                      type="text"
                      placeholder="Número de la tarjeta"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, '').slice(0,16))}
                      required
                      maxLength={16}
                    />
                    {errors.cardNumber && <span className="checkout-error">{errors.cardNumber}</span>}
                  </div>
                  <div className="checkout-form-row">
                    <div className="checkout-field">
                      <label>Fecha de vencimiento</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').slice(0,5))}
                        className="checkout-input"
                        required
                        maxLength={5}
                        style={{ width: '60%' }}
                        pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                        title="Formato MM/AA"
                      />
                      {errors.expiry && <span className="checkout-error">{errors.expiry}</span>}
                    </div>
                    <div className="checkout-field">
                      <label>CVC/CVV</label>
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cvc}
                        onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0,4))}
                        className="checkout-input"
                        required
                        maxLength={4}
                        style={{ width: '38%' }}
                      />
                      {errors.cvc && <span className="checkout-error">{errors.cvc}</span>}
                    </div>
                  </div>
                  <div className="checkout-save-card">
                    <input type="checkbox" id="saveCard" />
                    <label htmlFor="saveCard">Guardar esta tarjeta de forma segura para comprar más adelante</label>
                  </div>
                </div>
              )}
            </form>
          </section>

          {/* Order Summary Section */}
          <section className="checkout-summary-box">
            <div className="checkout-summary-inner">
              <span className="checkout-summary-title">Resumen</span>
              <div className="checkout-summary-items">
                {cartItems.map(item => (
                  <div className="checkout-summary-item" key={`${item.id}-${item.size}`}>
                    <img src={item.image} alt={item.name} className="checkout-summary-img" />
                    <div className="checkout-summary-details">
                      <span className="checkout-summary-name">{item.name}</span>
                      <span className="checkout-summary-size">{item.size ? `Talla: ${item.size}` : ''}</span>
                    </div>
                    <span className="checkout-summary-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-total-row">
                <span>Total:</span>
                <span className="checkout-summary-total">${total.toFixed(2)}</span>
              </div>
              <button className="checkout-complete-btn" onClick={handleCompletePayment}>Completar Pago</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
