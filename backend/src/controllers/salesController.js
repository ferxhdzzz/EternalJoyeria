// Importar el modelo de Sales desde la carpeta models
import Sale from "../models/sales.js" 

// Crear objeto para contener todos los métodos del controlador
const salesController = {};

// READ: Obtener todas las ventas
// Método para listar todas las ventas con información de las órdenes relacionadas
salesController.getSales = async (req, res) => {
  try {
    // Buscar todas las ventas y poblar los datos de la orden relacionada
    const allSales = await Sale.find().populate("idOrder");
    
    // Enviar respuesta exitosa con todas las ventas
    res.json(allSales);
  } catch (error) {
    // Manejo de errores del servidor
    res
      .status(500)
      .json({ message: "Error fetching sales", error: error.message });
  }
};

// READ: Obtener una venta específica
// Método para obtener una venta por su ID único
salesController.getSale = async (req, res) => {
  try {
    // Buscar venta por ID y poblar datos de la orden relacionada
    const sale = await Sale.findById(req.params.id).populate("idOrder");

    // Verificar si la venta existe
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    
    // Enviar respuesta exitosa con la venta encontrada
    res.json(sale);
  } catch (error) {
    // Manejo de errores (ID inválido u otros errores)
    res
      .status(400)
      .json({ message: "Error fetching sale", error: error.message });
  }
};

// Exportar el controlador para uso en las rutas
export default salesController;