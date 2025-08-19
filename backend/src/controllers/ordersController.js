// backend/src/controllers/ordersController.js
import mongoose from "mongoose";
import Order from "../models/Orders.js";
import Product from "../models/Products.js";
import Customer from "../models/Customers.js";

/* Utiles */
const isObjectId = (v) => mongoose.Types.ObjectId.isValid(String(v));
const toCents = (usd) => Math.max(0, Math.round(Number(usd || 0) * 100));
const nz = (n) => Math.max(0, Math.round(Number(n || 0)));

/* =================== FLUJO DE CARRITO =================== */

// GET /api/orders/cart -> obtiene/crea el “cart” del usuario (idempotente)
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

// PUT /api/orders/cart/items -> sincroniza items del frontend y recalcula totales
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

    // Siempre trabajar sobre el mismo cart (idempotente)
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

    // Traer precios reales
    const ids = cleaned.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } }, "price finalPrice images name");
    const priceMap = new Map(products.map((p) => [String(p._id), toCents(p.finalPrice ?? p.price)]));

    let totalItemsCents = 0;
    const normalized = cleaned
      .filter((it) => priceMap.has(it.productId))
      .map((it) => {
        const unitPriceCents = priceMap.get(it.productId);
        const subtotalCents = unitPriceCents * it.quantity;
        totalItemsCents += subtotalCents;
        return { productId: it.productId, quantity: it.quantity, unitPriceCents, subtotalCents, variant: it.variant };
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
    console.error("[orders] syncCartItems", err);
    return res.status(500).json({ message: "Error sincronizando carrito" });
  }
}

// PUT /api/orders/cart/addresses -> guarda snapshot de dirección
async function saveCartAddresses(req, res) {
  try {
    const userId = req.userId;
    const { shippingAddress } = req.body || {};

    let order = await Order.findOne({ idCustomer: userId, status: "cart" });
    if (!order) return res.status(404).json({ message: "Carrito no encontrado" });

    order.shippingAddress = shippingAddress || undefined;
    await order.save();

    const out = await Order.findById(order._id)
      .populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json(out);
  } catch (err) {
    console.error("[orders] saveCartAddresses", err);
    return res.status(500).json({ message: "Error guardando dirección" });
  }
}

// POST /api/orders/:orderId/pending -> mueve a pending_payment y retorna ref
async function moveToPending(req, res) {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, idCustomer: userId });
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    if (!order.totalCents || order.totalCents <= 0) {
      return res.status(400).json({ message: "El total de la orden es 0. No se puede pasar a pago." });
    }

    order.status = "pending_payment";
    const wompiReference = `WOMPI-${Date.now()}-${String(order._id).slice(-6)}`;
    order.wompiReference = wompiReference;
    await order.save();

    const out = await Order.findById(order._id)
      .populate("products.productId", "name images price finalPrice discountPercentage");

    return res.json({ wompiReference, order: out });
  } catch (err) {
    console.error("[orders] moveToPending", err);
    return res.status(500).json({ message: "Error moviendo a pending_payment" });
  }
}

/* =================== CRUD =================== */

async function createOrder(req, res) {
  try {
    const { idCustomer, products } = req.body;
    const customerExists = await Customer.findById(idCustomer);
    if (!customerExists) return res.status(400).json({ message: "Cliente no encontrado" });

    let total = 0;
    const productsWithSubtotal = await Promise.all(
      (products || []).map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Producto con ID ${item.productId} no encontrado`);
        const price = product.finalPrice ?? product.price;
        const subtotal = price * item.quantity;
        total += subtotal;
        return { productId: item.productId, quantity: item.quantity, subtotal };
      })
    );

    const newOrder = new Order({
      idCustomer,
      products: productsWithSubtotal,
      total,
      totalCents: toCents(total),
      status: "no pagado",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error: error.message });
  }
}

async function getOrders(_req, res) {
  try {
    const orders = await Order.find()
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes", error: error.message });
  }
}

async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error: error.message });
  }
}

async function updateOrder(req, res) {
  try {
    const { idCustomer, products, status } = req.body;
    const updatedData = {};
    let total = 0;

    if (idCustomer) {
      const customerExists = await Customer.findById(idCustomer);
      if (!customerExists) return res.status(400).json({ message: "Cliente no encontrado" });
      updatedData.idCustomer = idCustomer;
    }

    if (products && products.length > 0) {
      const productsWithSubtotal = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) throw new Error(`Producto con ID ${item.productId} no encontrado`);
          const price = product.finalPrice ?? product.price;
          const subtotal = price * item.quantity;
          total += subtotal;
          return { productId: item.productId, quantity: item.quantity, subtotal };
        })
      );
      updatedData.products = productsWithSubtotal;
      updatedData.total = total;
      updatedData.totalCents = toCents(total);
    }

    if (status && ["pagado", "no pagado", "cart", "pending_payment"].includes(status)) {
      updatedData.status = status;
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updatedData, { new: true })
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");

    if (!updatedOrder) return res.status(404).json({ message: "Orden no encontrada" });

    res.json({ message: "Orden actualizada correctamente", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error: error.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Orden no encontrada" });
    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error: error.message });
  }
}

async function markAsPaid(req, res) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "pagado" },
      { new: true }
    )
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");

    if (!updatedOrder) return res.status(404).json({ message: "Orden no encontrada" });
    res.json({ message: "Orden marcada como pagada", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar como pagada", error: error.message });
  }
}

/* ===== Export default ===== */
const ordersController = {
  getOrCreateCart,
  syncCartItems,
  saveCartAddresses,
  moveToPending,
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  markAsPaid,
};

export default ordersController;