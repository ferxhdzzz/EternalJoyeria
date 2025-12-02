import Order from "../models/Orders.js";
import Sale from "../models/sales.js";
import Product from "../models/Products.js";

// Función de stock (se mantiene igual, se usa en markOrderAsPaid)
async function updateProductStock(order) {
    if (!order?.products) return;

    for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        product.stock -= item.quantity;

        if (product.stock <= 0) {
            // Decides si eliminar o solo poner stock en 0 y marcar como no disponible
            // Lo mantengo como lo tienes:
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
        if (order.products.length === 0) return res.status(400).json({ message: "El carrito está vacío" });

        // 1. Pasar la orden a pendiente
        order.status = "pendiente"; // Estado de la Orden
        order.paymentStatus = "pending";
        order.paymentMethod = paymentMethod;
        order.shippingAddress = {
            line1: formData.direccion,
            // Agrega más campos si los tienes en formData (city, country, etc.)
        };
        order.email = formData.email;
        order.customerName = formData.nombre;

        await order.save();

        // 2. Crear la Venta (Sale) con estado "pending"
        // Asegúrate de que tu modelo Sale tenga un campo 'status' para poder guardarlo.
        const sale = await Sale.create({
            idOrder: order._id,
            idCustomers: order.idCustomer,
            total: order.total, // Usar total si totalCents no está bien poblado, o mejor totalCents / 100
            totalCents: order.totalCents, // Si lo manejas en centavos
            status: "pending", // <<-- ESTADO INICIAL DE LA VENTA (Para que el admin la vea)
            paymentMethod: paymentMethod,
            address: order.shippingAddress,
        });

        return res.json({
            success: true,
            message: "Orden creada como pendiente y Venta registrada",
            order,
            saleId: sale._id,
        });

    } catch (error) {
        console.error("❌ createPendingOrder error:", error);
        return res.status(500).json({ message: "Error al crear orden pendiente y registrar venta" });
    }
};


/* ========================================================
    CUANDO EL ADMIN MARQUE UNA ORDEN COMO PAGADA
    SE ACTUALIZA LA ORDEN, STOCK Y LA VENTA (SALE)
    ======================================================== */
export const markOrderAsPaid = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Orden no encontrada" });

        // 1. Actualizar Orden
        order.status = "pagado";
        order.paymentStatus = "completed";
        order.paymentDate = new Date();
        await order.save();

        // 2. Actualizar inventario
        await updateProductStock(order);

        // 3. Buscar y actualizar la Venta (Sale) asociada (ya creada en createPendingOrder)
        const sale = await Sale.findOneAndUpdate(
            { idOrder: order._id },
            {
                status: "completed", // <<-- ESTADO FINAL DE LA VENTA
                paymentDate: new Date(),
                // Puedes agregar más info aquí si es necesario
            },
            { new: true }
        );
        
        // Si por alguna razón no se creó la venta antes, se podría crear aquí como fallback,
        // pero la lógica principal asume que ya existe. Si la encuentras, actualiza.

        return res.json({
            success: true,
            message: "Orden marcada como pagada y Venta actualizada a completada",
            order,
            sale,
        });

    } catch (error) {
        console.error("❌ markOrderAsPaid error:", error);
        return res.status(500).json({ message: "Error al marcar como pagada" });
    }
};

// Mantener o eliminar markOrderAsPaid de ordersController.js si lo tienes duplicado.
// Revisa si 'finishOrder' en ordersController.js también debe ser eliminado o refactorizado.