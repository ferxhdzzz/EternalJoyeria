import Order from "../models/Orders.js";
import Product from "../models/Products.js";
import Customer from "../models/Customers.js";

const ordersController = {};

// CREATE: Crear orden con subtotal y total automáticos
ordersController.createOrder = async (req, res) => {
  try {
    const { idCustomer, products } = req.body;

    // Validar que el cliente exista
    const customerExists = await Customer.findById(idCustomer);
    if (!customerExists) {
      return res.status(400).json({ message: "Cliente no encontrado" });
    }

    let total = 0;

    const productsWithSubtotal = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
          productId: item.productId,
          quantity: item.quantity,
          subtotal,
        };
      })
    );

    const newOrder = new Order({
      idCustomer,
      products: productsWithSubtotal,
      total,
      status: "no pagado",
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (error) {
    res.status(500).json({
      message: "Error al crear la orden",
      error: error.message,
    });
  }
};

// READ ALL: Obtener todas las órdenes con datos específicos
ordersController.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener órdenes",
      error: error.message,
    });
  }
};

// READ ONE: Obtener una orden por ID con datos específicos
ordersController.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la orden",
      error: error.message,
    });
  }
};

// UPDATE: Actualizar solo el estado (o productos y cliente si quieres)
ordersController.updateOrder = async (req, res) => {
  try {
    const { idCustomer, products, status } = req.body;

    let total = 0;
    let productsWithSubtotal = [];

    // Validar que el cliente exista si se actualiza
    const updatedData = {};

    if (idCustomer) {
      const customerExists = await Customer.findById(idCustomer);
      if (!customerExists) {
        return res.status(400).json({ message: "Cliente no encontrado" });
      }
      updatedData.idCustomer = idCustomer;
    }

    if (products && products.length > 0) {
      productsWithSubtotal = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.productId);

          if (!product) {
            throw new Error(`Producto con ID ${item.productId} no encontrado`);
          }

          const subtotal = product.price * item.quantity;
          total += subtotal;

          return {
            productId: item.productId,
            quantity: item.quantity,
            subtotal,
          };
        })
      );
      updatedData.products = productsWithSubtotal;
      updatedData.total = total;
    }

    if (status && ["pagado", "no pagado"].includes(status)) {
      updatedData.status = status;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    )
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({
      message: "Orden actualizada correctamente",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la orden",
      error: error.message,
    });
  }
};

// DELETE: Eliminar una orden
ordersController.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la orden",
      error: error.message,
    });
  }
};

// PATCH: Marcar orden como pagada
ordersController.markAsPaid = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "pagado" },
      { new: true }
    )
      .populate("idCustomer", "firstName lastName email")
      .populate("products.productId", "name price discountPercentage finalPrice");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({
      message: "Orden marcada como pagada",
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al marcar como pagada",
      error: error.message,
    });
  }
};

export default ordersController;