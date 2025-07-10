import Sale from "../models/sales.js";

const salesController = {};

// CREATE: Crear una nueva venta
salesController.createSale = async (req, res) => {
  try {
    const { idOrder, address } = req.body;

    // Validación fuerte: no permitir campos vacíos ni solo espacios
    if (!idOrder || !address?.trim()) {
      return res.status(400).json({
        message: "idOrder y address son requeridos y no pueden estar vacíos",
      });
    }

    const newSale = new Sale({
      idOrder,
      address: address.trim(),
    });

    await newSale.save();

    const populatedSale = await Sale.findById(newSale._id).populate(
      "idOrder",
      "status total"
    );

    res.status(201).json({
      message: "Venta creada correctamente",
      sale: populatedSale,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creando la venta",
      error: error.message,
    });
  }
};

// READ: Obtener todas las ventas
salesController.getSales = async (req, res) => {
  try {
    const allSales = await Sale.find().populate("idOrder", "status total");
    res.json(allSales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sales", error: error.message });
  }
};

// READ: Obtener una venta específica
salesController.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "idOrder",
      "status total"
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching sale", error: error.message });
  }
};

// UPDATE: Actualizar una venta
salesController.updateSale = async (req, res) => {
  try {
    const { idOrder, address } = req.body;

    const updatedData = {};

    if (idOrder) updatedData.idOrder = idOrder;

    if (address !== undefined) {
      if (!address.trim()) {
        return res
          .status(400)
          .json({ message: "La dirección no puede estar vacía" });
      }
      updatedData.address = address.trim();
    }

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("idOrder", "status total");

    if (!updatedSale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({
      message: "Venta actualizada correctamente",
      sale: updatedSale,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error actualizando la venta",
      error: error.message,
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
      error: error.message,
    });
  }
};

export default salesController;
