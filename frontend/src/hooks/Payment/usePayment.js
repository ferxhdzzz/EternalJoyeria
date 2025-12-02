import { useRef, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

const OBJID = /^[a-f\d]{24}$/i;
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// ------------------------------------------------
// helper request
// ------------------------------------------------
async function request(path, { method = "GET", body, headers = {} } = {}) {
    const url = `${API_URL}${String(path).startsWith("/") ? path : `/${path}`}`;

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    const isJSON = res.headers.get("content-type")?.includes("application/json");
    const parse = async () => (isJSON ? res.json() : res.text());

    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const data = await parse();
            msg = (data && (data.message || data.error)) || msg;
        } catch {}
        const err = new Error(msg);
        err.status = res.status;
        throw err;
    }

    return parse();
}

// ------------------------------------------------
// Hook principal
// ------------------------------------------------
export default function usePayment() {
    const [step, setStep] = useState(1);

    const [order, setOrder] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [lockedOrderId, setLockedOrderId] = useState(null);

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        telefono: "",
    });

    const [errors, setErrors] = useState({});

    const [formDataTarjeta, setFormDataTarjeta] = useState({
        nombreTarjetaHabiente: "",
        numeroTarjeta: "",
        cvv: "",
        mesVencimiento: "",
        diasVencimiento: "", // Corregido: 'anioVencimiento' no existe en el payload
    });

    const [paymentMethod, setPaymentMethod] = useState("");
    const [showModal, setShowModal] = useState(false);

    const syncTimer = useRef(null);
    const { cartItems, clearCart } = useCart();

    // ------------------------------------------------
    // Validaciones paso 1
    // ------------------------------------------------
    const validateStep1 = () => {
        const newErrors = {};
        if (!String(formData.nombre || "").trim()) newErrors.nombre = "Nombre requerido";
        if (!String(formData.email || "").trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = "Email inválido";
        if (!String(formData.direccion || "").trim()) newErrors.direccion = "Dirección requerida";
        if (!String(formData.ciudad || "").trim()) newErrors.ciudad = "Ciudad requerida";
        if (!String(formData.codigoPostal || "").trim()) newErrors.codigoPostal = "Código postal requerido";
        if (!String(formData.telefono || "").trim()) newErrors.telefono = "Teléfono requerido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangeData = (e) => {
        const target = e?.target ? e.target : e;
        setFormData((p) => ({ ...p, [target.name]: target.value }));
    };

    const handleChangeTarjeta = (e) => {
        const target = e?.target ? e.target : e;
        setFormDataTarjeta((p) => ({ ...p, [target.name]: target.value })); 
    };

    // ------------------------------------------------
    // Cargar o crear carrito
    // ------------------------------------------------
    async function loadOrCreateCart() {
        const o = await request("/orders/cart");
        setOrder(o);
        setOrderId(o?._id || null);
        return o;
    }

    // ------------------------------------------------
    // Sincronizar items
    // ------------------------------------------------
    async function syncCartItems(
        items = cartItems,
        { shippingCents = 0, taxCents = 0, discountCents = 0 } = {},
        options = {}
    ) {
        if (!orderId) return;
        if (lockedOrderId) return;

        const itemsPayload = (items || [])
            .filter((it) => OBJID.test(String(it.id)) && Number(it.quantity) > 0)
            .map((it) => ({
                productId: it.id,
                quantity: Number(it.quantity || 0),
                variant: it.size ? { size: it.size } : undefined,
            }));

        const exec = async () => {
            const updated = await request("/orders/cart/items", {
                method: "PUT",
                body: { items: itemsPayload, shippingCents, taxCents, discountCents },
            });
            setOrder(updated);
            setOrderId(updated?._id || orderId);
            return updated;
        };

        if (options.immediate) return exec();

        if (syncTimer.current) clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(exec, 500);
    }

    // ------------------------------------------------
    // Guardar direcciones
    // ------------------------------------------------
    async function saveAddresses() {
        const payload = {
            shippingAddress: {
                name: formData.nombre,
                phone: formData.telefono,
                email: formData.email,
                line1: formData.direccion,
                city: formData.ciudad,
                zip: formData.codigoPostal,
            },
        };
        const updated = await request("/orders/cart/addresses", {
            method: "PUT",
            body: payload,
        });
        setOrder(updated);
        setOrderId(updated?._id || orderId);
        return updated;
    }


    // ------------------------------------------------
    // CREAR ORDEN PENDIENTE + REGISTRAR VENTA
    // ------------------------------------------------
    async function createPendingOrder(normalizedMethod) {
        const m = String(normalizedMethod || paymentMethod || "").toLowerCase();

        if (!orderId) throw new Error("No hay carrito.");

        if (!validateStep1()) throw new Error("Datos de envío incompletos");

        // 1. Guardar dirección y sincronizar carrito por última vez
        await saveAddresses();
        await syncCartItems(cartItems, {}, { immediate: true });

        const payload = {
            formData,
            paymentMethod:
                m === "paypal" || m === "paypal_native"
                    ? "paypal"
                    : m === "link"
                    ? "link"
                    : m === "transferencia" || m === "transfer"
                    ? "transferencia"
                    : "transferencia", // Fallback, asegura minúscula para el backend
        };

        // LLAMADA CLAVE: Llama al endpoint que cambia la Order a 'pendiente' y CREA la Sale.
        // *** CORRECCIÓN APLICADA AQUÍ: Se cambió la ruta a "/payments/create" ***
        const resp = await request("/payments/create", { 
            method: "POST",
            body: payload,
        });

        const outOrder = resp?.order || resp;
        setOrder(outOrder);
        setOrderId(outOrder?._id);

        setLockedOrderId(outOrder._id);

        try {
            clearCart();
        } catch {}

        return { success: true, resp };
    }

    // ------------------------------------------------
    // Admin marcar pagada
    // ------------------------------------------------
    async function markOrderAsPaidAdmin(orderIdToMark) {
        return await request("/payments/complete", {
            method: "POST",
            body: { orderId: orderIdToMark },
        });
    }

    // ------------------------------------------------
    // Navegación pasos
    // ------------------------------------------------
    const nextStep = async () => {
        if (step === 1) {
            if (!validateStep1()) return false;
            await saveAddresses();
            setStep(2);
            return true;
        }
        if (step < 3) {
            setStep(step + 1);
            return true;
        }
        return false;
    };

    const previousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setShowModal(false);
        }
    };

    // ------------------------------------------------
    // Finalizar compra (Manejo de PayPal/Métodos directos)
    // ------------------------------------------------
    const handlePay = async (opts = { openModalIfNeeded: true }) => {
        try {
            const normalized = String(paymentMethod).toLowerCase();

            // Si es Transferencia o Link, abre el modal y sale. La confirmación es en el modal.
            if (normalized === "transferencia" || normalized === "link") {
                if (opts.openModalIfNeeded) {
                    setShowModal(normalized === "transferencia" ? "transfer" : "link");
                }
                return { pending: true };
            }

            if (!paymentMethod) {
                Swal.fire("Selecciona un método de pago", "", "warning");
                throw new Error("Método requerido");
            }

            // Para PayPal (o cualquier otro método directo que solo necesite la Order Pendiente)
            Swal.fire({ title: "Procesando pedido...", icon: "info", timer: 800, showConfirmButton: false });

            const out = await createPendingOrder(paymentMethod); // Llama al backend que crea la Order y Sale Pendiente

            setStep(3);
            setShowModal(false);

            return out;
        } catch (err) {
            Swal.fire("Error", err.message, "error");
            throw err;
        }
    };

    // ------------------------------------------------
    // Botón "Siguiente" dentro del modal (Transferencia/Link)
    // ------------------------------------------------
    const handleNextFromModal = async () => {
        try {
            Swal.fire({ title: "Generando pedido...", icon: "info", timer: 900, showConfirmButton: false });

            const out = await createPendingOrder(paymentMethod); // Llama al backend que crea la Order y Sale Pendiente

            setStep(3);
            setShowModal(false);

            return out;
        } catch (err) {
            Swal.fire("Error", err.message, "error");
            throw err;
        }
    };

    const finishOrder = () => {
        setStep(1);
        setFormData({
            nombre: "",
            email: "",
            direccion: "",
            ciudad: "",
            codigoPostal: "",
            telefono: "",
        });
        setErrors({});
        setOrder(null);
        setOrderId(null);
        setLockedOrderId(null);
        setPaymentMethod("");
        setShowModal(false);
    };

    // ------------------------------------------------
    // cargar carrito al iniciar
    // ------------------------------------------------
    useEffect(() => {
        loadOrCreateCart().catch(() => {});
        return () => {
            if (syncTimer.current) clearTimeout(syncTimer.current);
        };
    }, []);

    return {
        step,
        setStep,
        order,
        orderId,
        lockedOrderId,

        formData,
        setFormData,
        errors,
        validateStep1,
        handleChangeData,

        formDataTarjeta,
        handleChangeTarjeta,

        paymentMethod,
        setPaymentMethod,
        showModal,
        setShowModal,

        loadOrCreateCart,
        syncCartItems,
        saveAddresses,
        createPendingOrder,
        markOrderAsPaidAdmin,

        nextStep,
        previousStep,
        handlePay,
        handleNextFromModal,
        finishOrder,

        clearCart,
    };
}