import fetch from "node-fetch";

console.log("📨 Servicio Brevo cargaAdo");


const apiKey = process.env.brevoApiKey;

// ⚠️ ESTE debe estar verificado en Brevo
const senderEmail = "lovercotes@gmail.com";

// Email del admin que recibe notificación
const adminEmail = "eternaljoyeriadeflores@gmail.com";

/* ======================================================
   📧 HTML EMAIL – CLIENTE
====================================================== */
const orderCustomerHTML = (order, customer) => {
    console.log("📨 Servicio Brevo cargado");

  const date = new Date(order.createdAt).toLocaleString("es-ES");

  const productsHTML = order.products.map(p => `
    <tr>
      <td style="padding:8px 0;">${p.productId.name}</td>
      <td align="center">${p.quantity}</td>
      <td align="right">$${(p.subtotalCents / 100).toFixed(2)}</td>
    </tr>
  `).join("");

  return `
  <html>
    <body style="font-family:Arial;background:#f9fafb;padding:20px">
      <table width="100%" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:24px">
      <h2 style="color:#db2777;">Pedido recibido</h2>

<p>Hola <strong>${customer.firstName}</strong>,</p>

<p>
Hemos recibido tu pedido correctamente.  
Tu orden se encuentra actualmente en estado <b>PENDIENTE DE CONFIRMACIÓN DE PAGO</b>.
</p>

<p>
 Una vez confirmado el pago, actualizaremos el estado automáticamente.  
Puedes verificarlo en cualquier momento desde tu <b>Historial de compras</b>.
</p>

<h2>
Detalle de la compra
</h2>


        <p><strong> Orden:</strong> ${order._id}</p>
        <p><strong> Fecha:</strong> ${date}</p>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <th align="left">Producto</th>
            <th>Cant.</th>
            <th align="right">Subtotal</th>
          </tr>
          ${productsHTML}
        </table>

        <hr/>

        <p style="font-size:18px;">
          <strong>Total:</strong> $${(order.totalCents / 100).toFixed(2)}
        </p>

        <p style="margin-top:20px;">
           Eternal Joyería – Gracias por confiar en nosotros
        </p>
      </table>
    </body>
  </html>
  `;
};

/* ======================================================
   📧 HTML EMAIL – ADMIN
====================================================== */
const orderAdminHTML = (order, customer) => {
  return `
  <html>
    <body style="font-family:Arial;background:#fff7ed;padding:20px">
      <table width="100%" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:24px">
        <h2 style="color:#16a34a;">🛍 Nueva orden recibida</h2>

        <p><strong>Cliente:</strong> ${customer.firstName} ${customer.lastName}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Orden ID:</strong> ${order._id}</p>

        <p style="font-size:18px;">
          <strong>Total:</strong> $${(order.totalCents / 100).toFixed(2)}
        </p>

     <p>
<strong>Estado:</strong> Pendiente de confirmación de pago
</p>
        <p>Revisa el panel de administración para más detalles.</p>
      </table>
    </body>
  </html>
  `;
};

/* ======================================================
   🚀 SENDERS
====================================================== */
const sendEmail = async ({ to, subject, html }) => {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Eternal Joyería", email: senderEmail },
      to,
      subject,
      htmlContent: html,
    }),
  });

  const text = await res.text();
  console.log("📨 Brevo response:", res.status, text);

  if (!res.ok) throw new Error(text);
};

/* ======================================================
   📤 FUNCIONES EXPORTADAS
====================================================== */
export const sendOrderEmailToCustomer = async (order, customer) => {
  console.log("📧 Enviando email a cliente:", customer?.email);
    await sendEmail({
    to: [{ email: customer.email, name: customer.firstName }],
    subject: "✨ Confirmación de tu compra – Eternal Joyería",
    html: orderCustomerHTML(order, customer),
  });
};

export const sendOrderEmailToAdmin = async (order, customer) => {
  await sendEmail({
    to: [{ email: adminEmail, name: "Administrador" }],
    subject: "🛎 Nueva venta registrada",
    html: orderAdminHTML(order, customer),
  });
};
