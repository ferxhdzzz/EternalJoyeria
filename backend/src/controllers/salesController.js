import Sale from "../models/sales.js";
import Order from "../models/Orders.js";
import Product from "../models/Products.js";
import mongoose from "mongoose";

const salesController = {};

/**
 * @description Verifica si un cliente específico ha comprado un producto.
 * GET /api/sales/check-purchase/:customerId/:productId
 */
salesController.checkProductPurchase = async (req, res) => {
  try {
    const { customerId, productId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(customerId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "IDs de cliente o producto no válidos." });
    }

    const sales = await Sale.find({ idCustomers: customerId })
      .populate({
        path: "idOrder",
        select: "products",
        populate: {
          path: "products.productId",
          model: "Products",
          select: "_id",
        },
      })
      .select("idOrder");

    let hasPurchased = false;

    for (const sale of sales) {
      if (sale.idOrder?.products?.length > 0) {
        const productFound = sale.idOrder.products.some(
          (item) => item.productId?._id.toString() === productId
        );
        if (productFound) {
          hasPurchased = true;
          break;
        }
      }
    }

    res.json({
      purchased: hasPurchased,
      message: hasPurchased
        ? "El cliente ha comprado este producto."
        : "El cliente no ha comprado este producto.",
    });
  } catch (error) {
    console.error("Error en checkProductPurchase:", error);
    res.status(500).json({
      message: "Error al verificar la compra del producto",
      error: error.message,
    });
  }
};

/**
 * @description Crea una nueva venta con snapshot de productos y dirección.
 */
salesController.createSale = async (req, res) => {
  try {
    const { idOrder, idCustomers, address } = req.body;

    if (!idOrder || !idCustomers || !address) {
      return res
        .status(400)
        .json({ message: "idOrder, idCustomers y address son requeridos" });
    }

    const order = await Order.findById(idOrder).populate({
      path: "products.productId",
      model: "Products",
      select: "name images price finalPrice discountPercentage",
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Snapshot de productos
    const productsSnapshot = order.products.map((item) => ({
      name: item.productId?.name,
      images: item.productId?.images || [],
      price: item.productId?.price || 0,
      finalPrice: item.productId?.finalPrice || 0,
      discountPercentage: item.productId?.discountPercentage || 0,
      quantity: item.quantity,
      subtotal: item.subtotal || item.subtotalCents / 100 || 0,
    }));

    // Snapshot de dirección
    const addressSnapshot = {
      name: address.name,
      phone: address.phone,
      email: address.email,
      line1: address.line1,
      city: address.city,
      region: address.region,
      country: address.country,
      zip: address.zip,
    };

    const newSale = new Sale({
      idOrder,
      idCustomers,
      total: order.total,
      addressSnapshot,
      productsSnapshot,
      status: "completed",
    });

    await newSale.save();

    const populatedSale = await Sale.findById(newSale._id)
      .populate("idOrder", "status total")
      .populate("idCustomers", "firstName lastName email");

    res.status(201).json({
      message: "Venta creada correctamente con snapshots",
      sale: populatedSale,
    });
  } catch (error) {
    console.error("Error creando la venta:", error);
    res.status(400).json({
      message: "Error creando la venta",
      error: error.message,
    });
  }
};

/**
 * @description Obtiene todas las ventas con información de orden, cliente y productos.
 */
salesController.getSales = async (req, res) => {
  try {
    const allSales = await Sale.find()
      .populate({
        path: "idOrder",
        populate: [
          { path: "idCustomer", select: "firstName lastName email" },
          { path: "products.productId", select: "name" },
        ],
        select: "status total products createdAt",
      })
      .populate("idCustomers", "firstName lastName email");

    res.json(allSales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ventas", error: error.message });
  }
};

/**
 * @description Obtiene todas las ventas para un cliente específico.
 */
salesController.getSalesByCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "ID de cliente no válido." });
    }

    const sales = await Sale.find({ idCustomers: customerId })
      .populate({
        path: "idOrder",
        populate: { path: "products.productId", model: "Products" },
      })
      .populate("idCustomers");

    res.json(sales);
  } catch (error) {
    console.error("Error en getSalesByCustomer:", error);
    res.status(500).json({
      message: "Error al obtener las ventas del cliente",
      error: error.message,
    });
  }
};

/**
 * @description Obtiene una venta específica con el estado de la orden.
 */
salesController.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("idOrder", "status total");

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener la venta", error: error.message });
  }
};

/**
 * @description Actualiza una venta existente.
 */
salesController.updateSale = async (req, res) => {
  try {
    const { status, address } = req.body;

    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Venta no encontrada" });

    if (status) await Order.findByIdAndUpdate(sale.idOrder, { status });
    if (address) {
      sale.addressSnapshot = address;
      await sale.save();
    }

    const populatedSale = await Sale.findById(sale._id)
      .populate("idOrder", "status total")
      .populate("idCustomers", "firstName lastName email");

    res.json({ message: "Venta actualizada correctamente", sale: populatedSale });
  } catch (error) {
    res.status(400).json({ message: "Error actualizando la venta", error: error.message });
  }
};

/**
 * @description Elimina una venta.
 */
salesController.deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) return res.status(404).json({ message: "Venta no encontrada" });

    res.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error eliminando la venta", error: error.message });
  }
};

/**
 * @description Lee SOLO las ventas del usuario autenticado (cliente).
 */
salesController.getMySales = async (req, res) => {
  try {
    const userId = req.userId;

    const mySales = await Sale.find({ idCustomers: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "idOrder",
        select: "status total totalCents currency createdAt products idCustomer",
        populate: [
          { path: "products.productId", select: "name images price finalPrice" },
          { path: "idCustomer", select: "firstName lastName email" },
        ],
      });

    res.json(mySales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tu historial de ventas", error: error.message });
  }
};

salesController.getSalesByCategory = async (req, res) => {
  try {
    const sales = await Sale.find({ idCustomers: customerId })
  .populate({
    path: 'idOrder',
    populate: [
      {
        path: 'products.id_Product', // debe coincidir con tu schema
        model: 'Products',
        select: 'name images price' // traemos lo necesario
      },
      {
        path: 'idCustomer',
        model: 'Customer',
        select: 'firstName lastName email'
      }
    ]
  });

    const ventasPorCategoria = {};

    sales.forEach(sale => {
      const order = sale.idOrder;
      if (!order) return;

      const fecha = order.createdAt || new Date();
      const mes = fecha.toLocaleString("es-ES", { month: "short" }).toLowerCase();

      order.products.forEach(p => {
        const categoria = p.productId?.categoryId?.name || "Sin categoría";
        const cantidad = p.quantity || 0;

        if (!ventasPorCategoria[categoria]) ventasPorCategoria[categoria] = {};
        if (!ventasPorCategoria[categoria][mes]) ventasPorCategoria[categoria][mes] = 0;

        ventasPorCategoria[categoria][mes] += cantidad;
      });
    });

    const resultado = Object.entries(ventasPorCategoria).map(([categoria, meses]) => ({
      categoria,
      datos: Object.entries(meses).map(([mes, ventas]) => ({ mes, ventas }))
    }));

    res.json(resultado);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ventas por categoría", error: error.message });
  }
};





/**
 * @description Obtiene las ventas agrupadas por mes para gráficos.
 */
salesController.getMonthlySales = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const sales = await Sale.find().populate({ path: "idOrder", select: "total createdAt" });

    const monthlyData = [
      { mes: "Ene", ventas: 0 },
      { mes: "Feb", ventas: 0 },
      { mes: "Mar", ventas: 0 },
      { mes: "Abr", ventas: 0 },
      { mes: "May", ventas: 0 },
      { mes: "Jun", ventas: 0 },
      { mes: "Jul", ventas: 0 },
      { mes: "Ago", ventas: 0 },
      { mes: "Sep", ventas: 0 },
      { mes: "Oct", ventas: 0 },
      { mes: "Nov", ventas: 0 },
      { mes: "Dic", ventas: 0 },
    ];

    sales.forEach((sale) => {
      if (!sale.idOrder) return;
      const date = new Date(sale.idOrder.createdAt);
      if (date.getFullYear() === parseInt(currentYear)) {
        monthlyData[date.getMonth()].ventas += sale.idOrder.total || 0;
      }
    });

    res.json({ success: true, year: currentYear, data: monthlyData });
  } catch (error) {
    console.error("Error en getMonthlySales:", error);
    res.status(500).json({ success: false, message: "Error al obtener las ventas mensuales", error: error.message });
  }
};

export default salesController;
