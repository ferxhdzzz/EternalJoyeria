// backend/src/controllers/wompiController.js
import fetch from "node-fetch";
import Order from "../models/Orders.js";
import Sale from "../models/sales.js";
import Product from "../models/Products.js"; // Asegúrate de que este modelo exista

const isMock = () =>
  String(process.env.wompiMode || "").toLowerCase() === "mock";

const nz = (n) => Math.max(0, Math.round(Number(n || 0)));
const toCents = (usd) => nz(usd * 100);

// Solo la línea de dirección escrita por el usuario
function onlyAddressLine(order, formData) {
  return (
    order?.shippingAddress?.line1 ||
    formData?.direccion ||
    formData?.direccionComprador ||
    "-"
  );
}

// URL de respaldo si el front no manda urlRedirect
function fallbackRedirect(req) {
  const origin =
    req.headers.origin ||
    process.env.corsOrigin ||
    "http://localhost:5173";
  return `${origin.replace(/\/$/, "")}/checkout`;
}

/* ================== LÓGICA DE INVENTARIO ================== */
async function updateProductStock(order) {
  if (!order || !Array.isArray(order.products)) {
    console.warn("⚠️ [StockUpdate] Orden o productos no válidos. Saltando actualización.");
    return;
  }

  const updates = order.products.map(async (item) => {
    const productId = item.productId;
    const quantityToSubtract = nz(item.quantity);

    if (!productId || quantityToSubtract <= 0) return;

    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantityToSubtract } },
        { $inc: { stock: -quantityToSubtract } },
        { new: true }
      );

      if (!updatedProduct) {
        console.error(`❌ [StockUpdate] Producto ${productId} no encontrado o stock insuficiente.`);
        return;
      }

      console.log(`✅ [StockUpdate] ${updatedProduct.name} nuevo stock: ${updatedProduct.stock}`);

      if (updatedProduct.stock === 0) {
        await Product.findByIdAndDelete(productId);
        console.log(`🗑️ [StockUpdate] Producto ${updatedProduct.name} eliminado por stock 0.`);
      }
    } catch (error) {
      console.error(`🛑 [StockUpdate] Error al actualizar producto ${productId}:`, error.message);
    }
  });

  await Promise.all(updates);
}
/* ========================================================== */

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
        grant_type: process.env.wompiGrantType,
        client_id: process.env.wompiClientId,
        client_secret: process.env.wompiClientSecret,
        audience: process.env.wompiAudience,
      }),
    });

    const text = await response.text();
    if (!response.ok) return res.status(response.status).json({ message: text });

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return res.json(data);
  } catch (err) {
    console.error("getWompiToken error:", err);
    return res.status(500).json({ message: "Error al obtener token de Wompi" });
  }
};

/* ================== PAGO 3DS ================== */
export const payment3ds = async (req, res) => {
  try {
    const userId = req.userId;
    const { token, formData = {}, orderId } = req.body || {};

    if (!token) return res.status(400).json({ message: "Token requerido" });
    if (!orderId) return res.status(400).json({ message: "orderId requerido" });

    const card = formData?.tarjetaCreditoDebido || null;
    if (!card || !card.numeroTarjeta || !card.cvv || !card.fechaExpiracion) {
      return res.status(400).json({
        message:
          "Faltan datos de tarjeta: tarjetaCreditoDebido.{numeroTarjeta, cvv, fechaExpiracion, nombreTarjetaHabiente}",
      });
    }

    let order = await Order.findOne({ _id: orderId, idCustomer: userId });
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    if (String(order.status).toLowerCase() === "pagado") {
      return res.status(409).json({ message: "La orden ya fue pagada" });
    }

    if (!order.totalCents || order.totalCents <= 0) {
      let computed = 0;
      if (Array.isArray(order.products) && order.products.length) {
        for (const it of order.products) {
          if (it?.subtotalCents) computed += nz(it.subtotalCents);
          else if (it?.unitPriceCents && it?.quantity)
            computed += nz(it.unitPriceCents) * Number(it.quantity);
          else if (it?.subtotal) computed += toCents(it.subtotal);
        }
      }
      computed += nz(order.shippingCents) + nz(order.taxCents) - nz(order.discountCents);
      if (computed > 0) {
        order.totalCents = computed;
        if (!order.total || order.total <= 0) order.total = computed / 100;
        await order.save();
      }
    }

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
      const num =
        String(formData?.numeroTarjeta || "") ||
        String(formData?.tarjetaCreditoDebido?.numeroTarjeta || "");
      const aprobada =
        num === "4111111111111111" || num.startsWith("424242") || num.endsWith("1111");

      if (!aprobada) {
        return res.status(402).json({
          estadoTransaccion: "RECHAZADA",
          message: "Pago rechazado (MOCK)",
          wompi: { mock: true },
        });
      }

      order.status = "pagado";
      order.paymentStatus = "completed";
      order.paymentDate = new Date();
      await order.save();

      await updateProductStock(order);

      // 💾 Crear snapshot de productos antes de eliminar por stock 0
      const populatedOrder = await Order.findById(order._id)
        .populate("products.productId", "name images price finalPrice discountPercentage");
      if (populatedOrder?.products?.length) {
        populatedOrder.products.forEach((p) => {
          if (p.productId) {
            p.productSnapshot = {
              name: p.productId.name,
              images: p.productId.images,
              price: p.productId.price,
              finalPrice: p.productId.finalPrice,
              discountPercentage: p.productId.discountPercentage,
            };
          }
        });
        await populatedOrder.save();
      }

      let existingSale = await Sale.findOne({ idOrder: order._id });
      if (!existingSale) {
        existingSale = await Sale.create({
          idOrder: order._id,
          idCustomers: order.idCustomer,
          address: onlyAddressLine(order, formData),
          total: order.total,
          status: "completed",
          paymentMethod: formData.paymentMethod || "credit_card",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const orderOut = await Order.findById(order._id)
        .populate("idCustomer", "firstName lastName email")
        .populate("products.productId", "name images price finalPrice discountPercentage");

      return res.json({
        estadoTransaccion: "APROBADA",
        success: true,
        sale: existingSale,
        order: orderOut,
        wompi: { mock: true },
      });
    }

    /* ================= LIVE ================= */
    const urlRedirect =
      formData?.urlRedirect && String(formData.urlRedirect).startsWith("http")
        ? formData.urlRedirect
        : fallbackRedirect(req);

    const referencia =
      formData?.referencia || `ORD-${String(order._id)}-${Date.now().toString().slice(-4)}`;

    const finalFormData = {
      ...formData,
      monto: order.totalCents,
      moneda: order.currency || "USD",
      urlRedirect,
      referencia,
      descripcion: formData?.descripcion || `Compra ${referencia}`,
    };

    const response = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalFormData),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.message || text || "Error en Wompi 3DS",
      });
    }

    const redirectUrl =
      data?.urlBanco || data?.urlAutenticacion || data?.redirect_url || data?.redirectUrl || null;
    if (redirectUrl) {
      return res.json({
        estadoTransaccion: data?.estadoTransaccion || "PENDIENTE_AUTENTICACION",
        redirectUrl,
        wompi: data,
      });
    }

    const estadoRaw = String(
      data?.estadoTransaccion || data?.estado || data?.status || ""
    ).toUpperCase();
    const aprobada = estadoRaw.includes("APROBA") || estadoRaw === "APPROVED";

    if (!aprobada) {
      return res.status(402).json({
        estadoTransaccion: data?.estadoTransaccion || "RECHAZADA",
        message: "Pago rechazado",
        data,
      });
    }

    order.status = "pagado";
    await order.save();

    await updateProductStock(order);

    // 💾 Crear snapshot de productos antes de eliminar por stock 0
    const populatedOrder = await Order.findById(order._id)
      .populate("products.productId", "name images price finalPrice discountPercentage");
    if (populatedOrder?.products?.length) {
      populatedOrder.products.forEach((p) => {
        if (p.productId) {
          p.productSnapshot = {
            name: p.productId.name,
            images: p.productId.images,
            price: p.productId.price,
            finalPrice: p.productId.finalPrice,
            discountPercentage: p.productId.discountPercentage,
          };
        }
      });
      await populatedOrder.save();
    }

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
