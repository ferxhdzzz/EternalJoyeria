import Sale from "../models/Sales.js";
import Order from "../models/Orders.js";
import Product from "../models/Products.js";
import mongoose from 'mongoose';

const salesController = {};

/**
 *Crea una nueva venta.
 * 
 */
salesController.createSale = async (req, res) => {
  try {
    const { idOrder, idCustomers, address } = req.body;

    if (!idOrder || !idCustomers || !address) {
      return res.status(400).json({ message: "idOrder, idCustomers y address son requeridos" });
    }

    const newSale = new Sale({
      idOrder,
      idCustomers,
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

/**
 * @description Obtiene todas las ventas con información de la orden, cliente y productos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
// READ: Obtener todas las ventas con populate en idOrder
salesController.getSales = async (req, res) => {
  try {
    const allSales = await Sale.find()
      .populate({
        path: "idOrder",
        // Aquí poblamos la orden para obtener su 'idCustomer' y los 'products'
        populate: [
          { path: "idCustomer", select: "firstName lastName email" },
          { path: "products.productId", select: "name" } // Seleccionamos solo el nombre del producto
        ],
        select: "status total products createdAt" // NOTA: No es necesario seleccionar el 'idCustomer' aquí si ya se ha poblado
      });
    res.json(allSales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

/**
 * @description Obtiene todas las ventas para un cliente específico.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
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
    populate: {
      path: "products.productId",  //este es el correcto
      model: "Products",
    },
  })
  .populate("idCustomers");  // para traer los datos del cliente
    if (sales.length > 0 && sales[0].idOrder) {
      console.log("Datos de ventas a enviar al frontend:", sales[0].idOrder.products);
    }

    res.json(sales);
  } catch (error) {
    console.error("Error en getSalesByCustomer:", error);
    res.status(500).json({ message: "Error al obtener las ventas del cliente", error: "Ocurrió un error inesperado en el servidor." });
  }
};


/**
 *Obtiene las ventas agrupadas por categoría y mes.
 *
 */
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
 * Obtiene una venta específica con el estado de la orden.

 */
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

/**
 * Actualiza una venta existente.

 */
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

/**
 *  Elimina una venta.

 */
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
