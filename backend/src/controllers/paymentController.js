import Order from "../models/Orders.js";
import Sale from "../models/sales.js";
import Product from "../models/Products.js";

// Función de stock (igual que la que usas en Wompi)
async function updateProductStock(order) {
    if (!order?.products) return;

    for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        product.stock -= item.quantity;

        if (product.stock <= 0) {
            await Product.findByIdAndDelete(product._id);
        } else {
            await product.save();
        }
    }
}

/* ============================================================
   ESTO SE USA para PayPal, Link de Pago y Transferencia
   ============================================================ */
export const createPendingOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { formData, paymentMethod } = req.body;

        if (!["paypal", "link", "transferencia"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Método de pago inválido" });
        }

        // Obtener el carrito existente
        let order = await Order.findOne({
            idCustomer: userId,
            status: "cart",
        });

        if (!order) return res.status(404).json({ message: "No hay carrito activo" });

        // Pasar la orden a pendiente
        order.status = "pendiente";
        order.paymentStatus = "pending";
        order.paymentMethod = paymentMethod;
        order.shippingAddress = {
            line1: formData.direccion,
        };
        order.email = formData.email;
        order.customerName = formData.nombre;

        await order.save();

        return res.json({
            success: true,
            message: "Orden creada como pendiente",
            order,
        });

    } catch (error) {
        console.error("❌ createPendingOrder error:", error);
        return res.status(500).json({ message: "Error al crear orden pendiente" });
    }
};


/* ========================================================
   CUANDO EL ADMIN MARQUE UNA ORDEN COMO PAGADA
   SE CREA LA VENTA AUTOMÁTICAMENTE
   ======================================================== */
export const markOrderAsPaid = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Orden no encontrada" });

        order.status = "pagado";
        order.paymentStatus = "completed";
        order.paymentDate = new Date();
        await order.save();

        // Actualizar inventario
        await updateProductStock(order);

        // Crear venta
        const sale = await Sale.create({
            idOrder: order._id,
            idCustomers: order.idCustomer,
            total: order.total,
            status: "completed",
            paymentMethod: order.paymentMethod,
        });

        return res.json({
            success: true,
            message: "Orden marcada como pagada y venta generada",
            sale,
        });

    } catch (error) {
        console.error("❌ markOrderAsPaid error:", error);
        return res.status(500).json({ message: "Error al marcar como pagada" });
    }
};
