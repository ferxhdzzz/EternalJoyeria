export const sendOrderPaidEmailToCustomer = async (order, customer) => {
  const html = `
  <div style="font-family:Arial;max-width:600px;margin:auto">
    <h2 style="color:#d63384">💖 ¡Pago confirmado!</h2>

    <p>Hola <strong>${customer.firstName}</strong>,</p>

    <p>
      Hemos recibido tu pago correctamente.
      Tu orden <strong>#${order._id}</strong> ahora está
      <strong>PAGADA</strong>.
    </p>

    <h3>🛍 Resumen de tu compra</h3>
    <ul>
      ${order.products.map(p => `
        <li>${p.productId.name} x ${p.quantity}</li>
      `).join("")}
    </ul>

    <p><strong>Total:</strong> $${(order.totalCents / 100).toFixed(2)}</p>

    <p>Gracias por confiar en nosotros ✨</p>
    <p>Eternal Joyería 💎</p>
  </div>
  `;

  await sendBrevoEmail({
    to: customer.email,
    subject: "💎 Tu pago fue confirmado",
    html,
  });
};
