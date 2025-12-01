// src/hooks/Payment/usePayment.js
import { useRef, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

const OBJID = /^[a-f\d]{24}$/i;
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/**
 * helper request: envía peticiones al backend con credentials incluidas
 */
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

export default function usePayment() {
  // UI / pasos
  const [step, setStep] = useState(1);

  // Orden / carrito en servidor
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null); // id del cart (status: cart)
  const [lockedOrderId, setLockedOrderId] = useState(null); // si se bloqueó (opcional)

  // Formulario de envío (este hook ahora lo maneja)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
  
  });

  const [errors, setErrors] = useState({});

  // tarjeta (mantenemos por compatibilidad si más adelante quieres tarjeta local)
  const [formDataTarjeta, setFormDataTarjeta] = useState({
    nombreTarjetaHabiente: "",
    numeroTarjeta: "",
    cvv: "",
    mesVencimiento: "",
    anioVencimiento: "",
  });

  // Modal / método
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showModal, setShowModal] = useState(false); // false | "transfer" | "link"

  // helpers internos
  const syncTimer = useRef(null);

  // carrito context
  const { cartItems, clearCart } = useCart();

  // ---------- VALIDACIONES ----------
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

  // ---------- Manejo inputs ----------
  const handleChangeData = (e) => {
    const target = e?.target ? e.target : e;
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTarjeta = (e) => {
    const target = e?.target ? e.target : e;
    const { name, value } = target;
    setFormDataTarjeta((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- API: carrito y direcciones ----------
  async function loadOrCreateCart() {
    const o = await request("/orders/cart");
    setOrder(o);
    setOrderId(o?._id || null);
    return o;
  }

  async function syncCartItems(
    items = cartItems,
    { shippingCents = 0, taxCents = 0, discountCents = 0 } = {},
    options = {}
  ) {
    if (!orderId) return;
    if (lockedOrderId) return; // si ya se bloqueó para pago, evitar sobrescribir

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

  async function saveAddresses() {
    const payload = {
      shippingAddress: {
        name: formData.nombre || "",
        phone: formData.telefono || "",
        email: formData.email || "",
        line1: formData.direccion || "",
        city: formData.ciudad || "",
        
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

  // ---------- NUEVO: crear orden pendiente centralizado ----------
  async function createPendingOrder(method) {
    if (!["paypal", "link", "transferencia", "paypal_native", "transfer"].includes(String(method).toLowerCase())) {
      // aceptamos variantes: PayPal (front usa "PayPal"), Transferencia, Link
      // normalizamos
      // permitimos "PayPal" "Link" "Transferencia" coming from UI; we'll send normalized to backend
    }
    const normalizedMethod = String(method || paymentMethod || "").toLowerCase();

    if (!orderId) {
      throw new Error("No hay carrito (orderId). Carga el carrito primero.");
    }

    // validar step1
    if (!validateStep1()) {
      throw new Error("Datos de envío incompletos");
    }

    // 1) guardar dirección y sincronizar items inmediatamente
    await saveAddresses();
    await syncCartItems(cartItems, {}, { immediate: true });

    // 2) preparar payload para backend
    const payload = {
      formData: {
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        codigoPostal: formData.codigoPostal,
        telefono: formData.telefono,
      },
      paymentMethod:
        normalizedMethod === "paypal" || normalizedMethod === "paypal_native" ? "paypal" :
        normalizedMethod === "link" ? "link" :
        normalizedMethod === "transferencia" || normalizedMethod === "transfer" ? "transferencia" :
        normalizedMethod || "transferencia",
    };

    // 3) Llamada al endpoint que creamos (backend)
    const resp = await request("/payments/create", {
      method: "POST",
      body: payload,
    });

    // resp debe traer order actualizado
    const outOrder = resp?.order || resp || null;

    if (!outOrder) {
      // fallback: intenta obtener el order actual del servidor
      try {
        const fresh = await loadOrCreateCart();
        setOrder(fresh);
      } catch (err) {}
    } else {
      setOrder(outOrder);
      setOrderId(outOrder._id || orderId);
    }

    // Bloqueamos (opcional)
    setLockedOrderId(outOrder?._id || orderId);

    // Limpiar carrito local
    try {
      clearCart();
    } catch (_e) {}

    return { success: true, resp };
  }

  // ---------- marcar como pagada (solo admin) ----------
  async function markOrderAsPaidAdmin(orderIdToMark) {
    // Este endpoint lo maneja paymentsController.markOrderAsPaid -> POST /payments/complete
    if (!orderIdToMark) throw new Error("orderId requerido");
    const resp = await request("/payments/complete", {
      method: "POST",
      body: { orderId: orderIdToMark },
    });
    return resp;
  }

  // ---------- flujo: next / previous / handlePay / modal ----------
  const nextStep = async () => {
    if (step === 1) {
      if (!validateStep1()) return false;
      // Guardamos direccion local y pasamos al paso 2
      // NOTA: no hacemos goPending aquí porque ahora la creación pending se hace cuando el usuario confirma pago
      try {
        await saveAddresses();
      } catch (err) {
        console.warn("No se pudo guardar dirección:", err.message || err);
      }
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

  // handlePay: se llama cuando el usuario presiona "Finalizar compra" (ej. PayPal)
  const handlePay = async (opts = { openModalIfNeeded: true }) => {
    try {
      // Si es PayPal -> directamente crear pending y (si quieres) redirigir a PayPal desde front
      const normalized = String(paymentMethod || "").toLowerCase();

      // si es transferencia o link, esperamos que el modal se use (front usa showModal)
      if (normalized === "transferencia" || normalized === "link") {
        // abrimos el modal correspondiente y el modal llamará a createPendingOrder cuando el usuario presione "Siguiente"
        if (opts.openModalIfNeeded) {
          if (normalized === "transferencia") setShowModal("transfer");
          if (normalized === "link") setShowModal("link");
        }
        return { pending: true, message: "Abrir modal para finalizar" };
      }

      if (!paymentMethod) {
        Swal.fire("Selecciona un método de pago", "", "warning");
        throw new Error("Selecciona método de pago");
      }

      Swal.fire({ title: "Procesando pedido...", icon: "info", timer: 1000, showConfirmButton: false });
      const out = await createPendingOrder(paymentMethod);

      // Si todo ok, paso a confirmación
      setStep(3);
      setShowModal(false);
      return out;
    } catch (err) {
      console.error("handlePay error:", err);
      Swal.fire("Error", err.message || "No se pudo procesar el pedido", "error");
      throw err;
    }
  };

  // El botón "Siguiente" del modal
  const handleNextFromModal = async () => {
    try {
      Swal.fire({ title: "Generando pedido...", icon: "info", timer: 900, showConfirmButton: false });
      const out = await createPendingOrder(paymentMethod);
      setStep(3);
      setShowModal(false);
      return out;
    } catch (err) {
      console.error("handleNextFromModal err:", err);
      Swal.fire("Error", err.message || "No se pudo generar el pedido", "error");
      throw err;
    }
  };

  const finishOrder = () => {
    // front-end navigation lo hace el componente; dejamos la función de conveniencia
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

  // ---------- efectos ----------
  // cuando el hook se monta, carga carrito
  useEffect(() => {
    loadOrCreateCart().catch((err) => {
      console.warn("No se pudo cargar/crear carrito:", err.message || err);
    });
    // limpiar timers al desmontar
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // estado / ui
    step,
    setStep,
    order,
    orderId,
    lockedOrderId,

    // form
    formData,
    setFormData,
    errors,
    setErrors,
    validateStep1,
    handleChangeData,

    formDataTarjeta,
    handleChangeTarjeta,

    // metodo / modal
    paymentMethod,
    setPaymentMethod,
    showModal,
    setShowModal,

    // acciones
    loadOrCreateCart,
    syncCartItems,
    saveAddresses,
    createPendingOrder,
    markOrderAsPaidAdmin,

    // flujo
    nextStep,
    previousStep,
    handlePay,
    handleNextFromModal,
    finishOrder,

    // utilidad
    clearCart, // expuesto por si el componente lo necesita
  };
}
