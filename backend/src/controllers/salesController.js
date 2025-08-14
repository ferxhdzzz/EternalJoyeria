import Sale from "../models/sales.js";
import Order from "../models/Orders.js";

const salesController = {};

// CREATE: Crear una nueva venta
salesController.createSale = async (req, res) => {
  try {
    const { idOrder, address } = req.body;

    if (!idOrder || !address) {
      return res.status(400).json({ message: "idOrder y address son requeridos" });
    }

    const newSale = new Sale({
      idOrder,
      address
    });

    await newSale.save();

    const populatedSale = await Sale.findById(newSale._id).populate("idOrder", "status total");

    res.status(201).json({
      message: "Venta creada correctamente",
      sale: populatedSale
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creando la venta",
      error: error.message
    });
  }
};

// READ: Obtener todas las ventas con populate en idOrder
salesController.getSales = async (req, res) => {
  try {
    const allSales = await Sale.find()
      .populate({
        path: "idOrder",
        populate: [
          { path: "idCustomer", select: "firstName lastName email" },
          { path: "products.productId", select: "name categoryId" }
        ],
        select: "status total products idCustomer createdAt"
      });
    res.json(allSales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

// READ: Obtener ventas agrupadas por categoría y mes
salesController.getSalesByCategory = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({
        path: "idOrder",
        populate: {
          path: "products.productId",
          populate: {
            path: "categoryId",
            select: "name"
          }
        },
        select: "products createdAt"
      });

    const ventasPorCategoria = {};

    sales.forEach(sale => {
      const order = sale.idOrder;
      if (!order) return;

      // Fecha para mes, si no existe usar fecha actual (por seguridad)
      const fecha = order.createdAt || new Date();
      // Sacar mes abreviado en español en minúsculas
      const mes = fecha.toLocaleString("es-ES", { month: "short" }).toLowerCase();

      order.products.forEach(p => {
        const categoria = p.productId?.categoryId?.name || "Sin categoría";
        const cantidad = p.quantity || 0;

        if (!ventasPorCategoria[categoria]) ventasPorCategoria[categoria] = {};
        if (!ventasPorCategoria[categoria][mes]) ventasPorCategoria[categoria][mes] = 0;

        ventasPorCategoria[categoria][mes] += cantidad;
      });
    });

    // Transformar el objeto a array para frontend
    const resultado = Object.entries(ventasPorCategoria).map(([categoria, meses]) => ({
      categoria,
      datos: Object.entries(meses).map(([mes, ventas]) => ({ mes, ventas }))
    }));

    res.json(resultado);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ventas por categoría", error: error.message });
  }
};

// READ: Obtener una venta específica con status de la orden
salesController.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("idOrder", "status total");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: "Error fetching sale", error: error.message });
  }
};

// UPDATE: Actualizar una venta
salesController.updateSale = async (req, res) => {
  try {
    const { status, address } = req.body;

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    if (status) {
      await Order.findByIdAndUpdate(sale.idOrder, { status: status });
    }

    if (address) {
      sale.address = address;
      await sale.save();
    }

    const populatedSale = await Sale.findById(sale._id).populate("idOrder", "status total");

    res.json({
      message: "Venta actualizada correctamente",
      sale: populatedSale
    });
  } catch (error) {
    res.status(400).json({
      message: "Error actualizando la venta",
      error: error.message
    });
  }
};

// DELETE: Eliminar una venta
salesController.deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({ message: "Venta eliminada correctamente" });

  } catch (error) {
    res.status(400).json({
      message: "Error eliminando la venta",
      error: error.message
    });
  }
};

export default salesController;
