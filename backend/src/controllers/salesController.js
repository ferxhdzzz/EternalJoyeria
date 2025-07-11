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

    // Opcional: populate al crear
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

// READ: Obtener todas las ventas con status de la orden
salesController.getSales = async (req, res) => {
  try {
    const allSales = await Sale.find()
      .populate({
        path: "idOrder",
        populate: [
          { path: "idCustomer", select: "firstName lastName email" },
          { path: "products.productId", select: "name" }
        ],
        select: "status total products idCustomer"
      });
    res.json(allSales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
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
    const { status, address } = req.body; // status es para la orden, address para la venta

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Actualizar el status de la orden si viene en el body
    if (status) {
      // Actualizamos directamente el documento Order referenciado
      await Order.findByIdAndUpdate(sale.idOrder, { status: status });
    }

    // Actualizar la dirección en la venta
    if (address) {
      sale.address = address;
      await sale.save();
    }

    // Recuperar la venta poblada con la orden actualizada
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