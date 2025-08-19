// backend/src/controllers/wompiController.js
import fetch from "node-fetch";
import Order from "../models/Orders.js";
import Sale from "../models/sales.js";

const isMock = () => String(process.env.WOMPI_MODE || "").toLowerCase() === "mock";

const nz = (n) => Math.max(0, Math.round(Number(n || 0)));
const toCents = (usd) => nz(usd * 100);

// Solo la línea escrita por el usuario en “Dirección”
function onlyAddressLine(order, formData) {
  return (
    order?.shippingAddress?.line1 ||
    formData?.direccion ||
    formData?.direccionComprador ||
    "-"
  );
}

// urlRedirect de respaldo si el front no envía uno
function fallbackRedirect(req) {
  const origin =
    req.headers.origin ||
    process.env.corsOrigin ||
    "http://localhost:5173";
  return `${origin.replace(/\/$/, "")}/checkout`;
}

/* ================== TOKEN OAuth ================== */
export const getWompiToken = async (_req, res) => {
  try {
    if (isMock()) {
      return res.json({
        access_token: "mock-access-token",
        token_type: "bearer",
        expires_in: 3600,
      });
    }

    const response = await fetch("https://id.wompi.sv/connect/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: process.env.GRANT_TYPE,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ message: text });
    }
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return res.json(data);
  } catch (err) {
    console.error("getWompiToken error:", err);
    return res.status(500).json({ message: "Error al obtener token de Wompi" });
  }
};

/* ================== Pago tokenizado SIN 3DS (opcional) ================== */
export const testPayment = async (req, res) => {
  try {
    const { token, formData = {} } = req.body || {};

    if (isMock()) {
      const num = String(formData?.tarjetaCreditoDebido?.numeroTarjeta || formData?.numeroTarjeta || "");
      const aprobada = num === "4111111111111111" || num.startsWith("424242") || num.endsWith("1111");
      if (!aprobada) {
        return res.status(402).json({ estadoTransaccion: "RECHAZADA", message: "Pago rechazado (MOCK)", wompi: { mock: true } });
      }
      return res.json({ estadoTransaccion: "APROBADA", wompi: { mock: true } });
    }

    if (!token) return res.status(400).json({ message: "Token requerido" });
    if (!formData) return res.status(400).json({ message: "formData requerido" });

    const r = await fetch("https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) return res.status(r.status).json({ message: data?.message || text || "Error en Wompi (sin 3DS)" });
    return res.json(data);
  } catch (err) {
    console.error("testPayment error:", err);
    return res.status(500).json({ message: "Error al procesar pago de prueba" });
  }
};

/* ================== PAGO 3DS (principal) ================== */
export const payment3ds = async (req, res) => {
  try {
    const userId = req.userId; // requiere validateAuthToken(['admin','customer'])
    const { token, formData = {}, orderId } = req.body || {};

    if (!orderId) return res.status(400).json({ message: "orderId requerido" });

    // Cargar y validar la orden del usuario
    let order = await Order.findOne({ _id: orderId, idCustomer: userId });
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    // Idempotencia simple
    if (String(order.status).toLowerCase() === "pagado") {
      return res.status(409).json({ message: "La orden ya fue pagada" });
    }

    /* === Asegurar totalCents > 0 === */
    if (!order.totalCents || order.totalCents <= 0) {
      let computed = 0;

      if (Array.isArray(order.products) && order.products.length) {
        for (const it of order.products) {
          if (it?.subtotalCents) {
            computed += nz(it.subtotalCents);
          } else if (it?.unitPriceCents && it?.quantity) {
            computed += nz(it.unitPriceCents) * Number(it.quantity);
          } else if (it?.subtotal) {
            computed += toCents(it.subtotal); // legacy USD
          }
        }
      }
      computed += nz(order.shippingCents) + nz(order.taxCents) - nz(order.discountCents);

      if (computed > 0) {
        order.totalCents = computed;
        if (!order.total || order.total <= 0) order.total = computed / 100;
        await order.save();
      }
    }

    // En MOCK, si por alguna razón sigue en 0, fuerza $1.00 solo para probar
    if ((!order.totalCents || order.totalCents <= 0) && isMock()) {
      order.totalCents = 100;
      order.total = 1;
      await order.save();
    }

    if (!order.totalCents || order.totalCents <= 0) {
      return res.status(400).json({ message: "Total de orden inválido" });
    }

    /* ================= MOCK ================= */
    if (isMock()) {
      // En mock NO exigimos estructura estricta
      const num = String(formData?.tarjetaCreditoDebido?.numeroTarjeta || formData?.numeroTarjeta || "");
      const aprobada = num === "4111111111111111" || num.startsWith("424242") || num.endsWith("1111");

      if (!aprobada) {
        return res.status(402).json({
          estadoTransaccion: "RECHAZADA",
          message: "Pago rechazado (MOCK)",
          wompi: { mock: true },
        });
      }

      order.status = "pagado";
      await order.save();

      const sale = await Sale.create({
        idOrder: order._id,
        idCustomers: order.idCustomer,
        address: onlyAddressLine(order, formData),
      });

      const orderOut = await Order.findById(order._id)
        .populate("idCustomer", "firstName lastName email")
        .populate("products.productId", "name images price finalPrice discountPercentage");

      return res.json({
        estadoTransaccion: "APROBADA",
        sale,
        order: orderOut,
        wompi: { mock: true },
      });
    }

    /* ================= LIVE ================= */
    if (!token) return res.status(400).json({ message: "Token requerido" });

    // Validación mínima SOLO en live
    const card = formData?.tarjetaCreditoDebido || {};
    if (!card.numeroTarjeta || !card.cvv || !card.fechaExpiracion || !card.nombreTarjetaHabiente) {
      return res.status(400).json({
        message: "Faltan datos de tarjeta: tarjetaCreditoDebido.{numeroTarjeta, cvv, fechaExpiracion, nombreTarjetaHabiente}",
      });
    }

    // Garantizamos urlRedirect y referencia
    const urlRedirect =
      formData?.urlRedirect && String(formData.urlRedirect).startsWith("http")
        ? formData.urlRedirect
        : fallbackRedirect(req);

    const referencia =
      formData?.referencia ||
      `ORD-${String(order._id)}-${Date.now().toString().slice(-4)}`;

    const finalFormData = {
      ...formData,
      monto: order.totalCents,                // centavos
      moneda: order.currency || "USD",
      urlRedirect,
      referencia,
      descripcion: formData?.descripcion || `Compra ${referencia}`,
    };

    const r = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(finalFormData),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      return res.status(r.status).json({ message: data?.message || text || "Error en Wompi 3DS" });
    }

    // ¿Requiere autenticación adicional? → devolvemos URL para redirección desde el front
    const redirectUrl =
      data?.urlBanco || data?.urlAutenticacion || data?.redirect_url || data?.redirectUrl || null;

    if (redirectUrl) {
      return res.json({
        estadoTransaccion: data?.estadoTransaccion || data?.estado || "PENDIENTE_AUTENTICACION",
        redirectUrl,
        wompi: data,
      });
    }

    const estadoRaw = String(data?.estadoTransaccion || data?.estado || data?.status || "").toUpperCase();
    const aprobada = estadoRaw.includes("APROBA") || estadoRaw === "APPROVED";

    if (!aprobada) {
      return res.status(402).json({
        estadoTransaccion: data?.estadoTransaccion || data?.estado || "RECHAZADA",
        message: "Pago rechazado",
        data,
      });
    }

    // Pago aprobado
    order.status = "pagado";
    await order.save();

    const sale = await Sale.create({
      idOrder: order._id,
      idCustomers: order.idCustomer,
      address: onlyAddressLine(order, formData),
    });

    const orderOut = await Order.findById(order._id)
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json({
      estadoTransaccion: "APROBADA",
      sale,
      order: orderOut,
      wompi: data,
    });
  } catch (err) {
    console.error("payment3ds error:", err);
    return res.status(500).json({ message: "Error al procesar pago 3DS" });
  }
};
