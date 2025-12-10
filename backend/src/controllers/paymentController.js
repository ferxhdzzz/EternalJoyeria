import Order from "../models/Orders.js";
import Sale from "../models/sales.js";
import Product from "../models/Products.js";

// ---------------- STOCK ----------------
async function updateProductStock(order) {
    if (!order?.products) return;

    for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        product.stock -= item.quantity;

        if (product.stock <= 0) {
            product.stock = 0;           // nunca negativo
            product.status = "agotado";  // estado agotado
        }

        await product.save(); // 🔥 NECESARIO PARA GUARDAR CAMBIOS
    }
}


/* ============================================================
        CREAR ORDEN PENDIENTE (Paso 3 – Checkout)
    ============================================================ */
// ============================================================
// CREATE PENDING ORDER (PayPal, Link, Transferencia)
// ============================================================
export const createPendingOrder = async (req, res) => {
    try {
        const userId = req.userId;

        // 💡 CAMBIO: Agregamos region y country, que son parte del addressSchema
        const { 
            nombre,
            email,
            direccion,
            ciudad,
            codigoPostal,
            telefono,
            region, 
            country,
            paymentMethod 
        } = req.body;

        if (!["paypal", "link", "transferencia"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Método de pago inválido" });
        }

        let order = await Order.findOne({
            idCustomer: userId,
            status: "cart",
        });

        if (!order) return res.status(404).json({ message: "No hay carrito activo" });
        if (order.products.length === 0) return res.status(400).json({ message: "El carrito está vacío" });

        // PASAR ORDEN A PENDIENTE
        order.status = "pendiente";
        order.paymentStatus = "pending";
        order.paymentMethod = paymentMethod;

        // ✔ CORRECCIÓN: Guardar la dirección completa en el objeto de shippingAddress de la Order
        order.shippingAddress = {
            name: nombre,
            email,
            phone: telefono,
            line1: direccion, // Mapea tu campo 'direccion' a 'line1'
            city: ciudad,
            zip: codigoPostal,
            region: region,     // Asegúrate de enviar este dato desde el frontend
            country: country,   // Asegúrate de enviar este dato desde el frontend
        };

        // ❌ Eliminado: Los campos order.email y order.customerName no están en tu ordersSchema
        // order.email = email;
        // order.customerName = nombre;

        await order.save();

        // -----------------------------
        // CREAR VENTA (SALE) → STRING (Con la corrección de los datos)
        // -----------------------------
        // ✔ CORRECCIÓN: Crear la cadena de dirección bien formateada para el campo 'address' en Sales
        const addressString = `[${nombre}] - ${direccion}, ${ciudad}, ${codigoPostal}, ${region}, ${country} | Tel: ${telefono} | Email: ${email}`;

        const sale = await Sale.create({
            idOrder: order._id,
            idCustomers: order.idCustomer,
            address: addressString,   // ✔ Aquí es donde se guarda el string completo
            total: order.total,
            totalCents: order.totalCents,
            status: "pending",
            paymentMethod,
        });

        return res.json({
            success: true,
            message: "Orden creada como pendiente y Venta registrada",
            order,
            saleId: sale._id,
        });

    } catch (error) {
        console.error("❌ createPendingOrder error:", error);
        return res.status(500).json({ message: "Error al crear orden pendiente y registrar venta", error: error.message });
    }
};


/* ============================================================
        ADMIN → MARCAR ORDEN COMO PAGADA (Se mantiene igual)
    ============================================================ */
export const markOrderAsPaid = async (req, res) => {
    // ... (Esta función se mantiene igual, ya que solo actualiza el estado)
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Orden no encontrada" });

        // Actualizar Orden
        order.status = "pagado";
        order.paymentStatus = "completed"; // Asumo que tienes este campo en tu schema (no lo vi, pero lo mantengo)
        order.paymentDate = new Date(); // Asumo que tienes este campo en tu schema
        await order.save();

        // Actualizar inventario
        await updateProductStock(order);

        // Actualizar Venta (Sale)
        const sale = await Sale.findOneAndUpdate(
            { idOrder: order._id },
            {
                status: "completed",
                paymentDate: new Date(), // Asumo que tienes este campo en tu schema
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Orden marcada como pagada y Venta actualizada",
            order,
            sale,
        });

    } catch (error) {
        console.error("❌ markOrderAsPaid error:", error);
        return res.status(500).json({ message: "Error al marcar como pagada" });
    }
};