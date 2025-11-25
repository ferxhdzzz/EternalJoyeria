// backend/src/controllers/ordersController.js
import mongoose from "mongoose";
import Order from "../models/Orders.js";
import Product from "../models/Products.js";
import Customer from "../models/Customers.js";
import Sale from "../models/sales.js";

/* Utiles */
const isObjectId = (v) => mongoose.Types.ObjectId.isValid(String(v));
const toCents = (usd) => Math.max(0, Math.round(Number(usd || 0) * 100));
const nz = (n) => Math.max(0, Math.round(Number(n || 0)));

/* =================== FLUJO DE CARRITO =================== */

// GET /api/orders/cart -> obtiene/crea el carrito
async function getOrCreateCart(req, res) {
  try {
    const userId = req.userId;

    const order = await Order.findOneAndUpdate(
      { idCustomer: userId, status: "cart" },
      {
        $setOnInsert: {
          idCustomer: userId,
          products: [],
          total: 0,
          totalCents: 0,
          currency: "USD",
          shippingCents: 0,
          taxCents: 0,
          discountCents: 0,
          status: "cart",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json(order);
  } catch (err) {
    console.error("[orders] getOrCreateCart", err);
    return res.status(500).json({ message: "Error obteniendo/creando carrito" });
  }
}

// PUT /api/orders/cart/items -> update de carrito
async function syncCartItems(req, res) {
  try {
    const userId = req.userId;
    const { items = [], shippingCents = 0, taxCents = 0, discountCents = 0 } = req.body || {};

    const cleaned = (Array.isArray(items) ? items : [])
      .filter((it) => isObjectId(it?.productId) && Number(it?.quantity) > 0)
      .map((it) => ({
        productId: String(it.productId),
        quantity: Math.max(1, parseInt(it.quantity, 10)),
        variant: it?.variant || undefined,
      }));

    let order = await Order.findOneAndUpdate(
      { idCustomer: userId, status: "cart" },
      {
        $setOnInsert: {
          idCustomer: userId,
          products: [],
          total: 0,
          totalCents: 0,
          currency: "USD",
          shippingCents: 0,
          taxCents: 0,
          discountCents: 0,
          status: "cart",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (cleaned.length === 0) {
      order.products = [];
      order.totalCents = 0;
      order.total = 0;
      order.shippingCents = nz(shippingCents);
      order.taxCents = nz(taxCents);
      order.discountCents = nz(discountCents);
      await order.save();

      const out = await Order.findById(order._id)
        .populate("products.productId", "name images price finalPrice discountPercentage");

      return res.json(out);
    }

    const ids = cleaned.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } }, "price finalPrice images name");

    const priceMap = new Map(
      products.map((p) => [
        String(p._id),
        toCents(p.finalPrice ?? p.price)
      ])
    );

    let totalItemsCents = 0;

    const normalized = cleaned
      .filter((it) => priceMap.has(it.productId))
      .map((it) => {
        const unitPriceCents = priceMap.get(it.productId);
        const subtotalCents = unitPriceCents * it.quantity;
        totalItemsCents += subtotalCents;

        return {
          productId: it.productId,
          quantity: it.quantity,
          unitPriceCents,
          subtotalCents,
          variant: it.variant,
        };
      });

    const ship = nz(shippingCents);
    const tax = nz(taxCents);
    const disc = nz(discountCents);
    const totalCents = Math.max(0, totalItemsCents + ship + tax - disc);

    order.products = normalized;
    order.shippingCents = ship;
    order.taxCents = tax;
    order.discountCents = disc;
    order.totalCents = totalCents;
    order.total = totalCents / 100;
    order.currency = "USD";

    await order.save();

    const out = await Order.findById(order._id)
      .populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json(out);
  } catch (err) {
    console.error("[orders] syncCartItems ERROR:", err);
    return res.status(500).json({ message: "Error sincronizando carrito", error: err.message });
  }
}

// PUT /api/orders/cart/addresses
async function saveCartAddresses(req, res) {
  try {
    const userId = req.userId;
    const { shippingAddress } = req.body || {};

    let order = await Order.findOne({ idCustomer: userId, status: "cart" });
    if (!order) return res.status(404).json({ message: "Carrito no encontrado" });

    order.shippingAddress = shippingAddress;
    await order.save();

    const out = await Order.findById(order._id)
      .populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json(out);
  } catch (err) {
    console.error("[orders] saveCartAddresses", err);
    return res.status(500).json({ message: "Error guardando dirección" });
  }
}

// POST /api/orders/:orderId/pending -> paso 2
async function moveToPending(req, res) {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, idCustomer: userId, status: "cart" });
    if (!order) return res.status(404).json({ message: "Carrito no encontrado o ya no está en estado 'cart'" });

    if (!order.totalCents || order.totalCents <= 0) {
      return res.status(400).json({ message: "El total es 0. No se puede continuar." });
    }

    order.status = "pending_payment";
    order.wompiReference = `WOMPI-${Date.now()}-${String(order._id).slice(-6)}`;

    await order.save();

    return res.json({
      wompiReference: order.wompiReference,
      order
    });
  } catch (err) {
    console.error("[orders] moveToPending", err);
    return res.status(500).json({ message: "Error moviendo a pending_payment" });
  }
}

/* ================== 🔥 PASO 3: MARCAR COMO PENDIENTE MANUAL ================== */

async function markAsPendingManual(req, res) {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      idCustomer: userId,
      status: "pending_payment",
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada o no está pendiente de pago" });
    }

    order.status = "PENDIENTE";
   const allow = {
  transferencia: "Transferencia",
  link: "Link",
  paypal: "PayPal",
  wompi: "Wompi",
};

order.paymentMethod = allow[paymentMethod] || undefined;


    await order.save();

    await Sale.findOneAndDelete({ idOrder: order._id });

    const newSale = new Sale({
      idOrder: order._id,
      idCustomer: userId,
      address: order.shippingAddress,
      dateSale: new Date(),
    });

    await newSale.save();

    const out = await Order.findById(order._id)
      .populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json({
      message: "Orden marcada como PENDIENTE y venta creada",
      order: out,
      saleId: newSale._id,
    });
  } catch (err) {
    console.error("[orders] markAsPendingManual", err);
    return res.status(500).json({ message: "Error registrando pago manual" });
  }
}

/* =================== CRUD =================== */

async function createOrder() {}
async function updateOrder() {}
async function deleteOrder() {}
async function getOrder() {}
async function getOrders() {}

async function markAsPaid(req, res) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "pagado" },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Orden no encontrada" });

    res.json({ message: "Orden marcada como pagada", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar como pagada", error: error.message });
  }
}

// GET /api/orders/user
async function getUserOrders(req, res) {
  try {
    const userId = req.userId;

    const orders = await Order.find({ idCustomer: userId })
      .populate("products.productId", "name images price finalPrice discountPercentage")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes del usuario", error: error.message });
  }
}

export default {
  getOrCreateCart,
  syncCartItems,
  saveCartAddresses,
  moveToPending,
  markAsPendingManual,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getOrders,
  markAsPaid,
  getUserOrders,
};
