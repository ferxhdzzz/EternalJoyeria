import { useRef, useState } from "react";

const OBJID = /^[a-f\d]{24}$/i;
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Helper interno para requests con manejo de errores uniforme
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
  const [step, setStep] = useState(1);

  // Estado de Order en servidor
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);             // carrito actual (status: cart)
  const [lockedOrderId, setLockedOrderId] = useState(null); // orden “congelada” en pending_payment
  const [wompiReference, setWompiReference] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Datos del formulario (envío)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    idPais: "SV",
    idRegion: "SV-SS",
  });

  // Datos de tarjeta
  const [formDataTarjeta, setFormDataTarjeta] = useState({
    nombreTarjetaHabiente: "",
    numeroTarjeta: "",
    cvv: "",
    mesVencimiento: "",
    anioVencimiento: "",
  });

  // debounce para syncCartItems
  const syncTimer = useRef(null);

  const handleChangeData = (e) => {
    const { name, value } = e.target || e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTarjeta = (e) => {
    const { name, value } = e.target || e;
    setFormDataTarjeta((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
      telefono: "",
      idPais: "SV",
      idRegion: "SV-SS",
    });
    setFormDataTarjeta({
      nombreTarjetaHabiente: "",
      numeroTarjeta: "",
      cvv: "",
      mesVencimiento: "",
      anioVencimiento: "",
    });
    setStep(1);
    setOrder(null);
    setOrderId(null);
    setLockedOrderId(null);
    setWompiReference(null);
    setAccessToken(null);
    if (syncTimer.current) clearTimeout(syncTimer.current);
  };

  /* === API === */

  // Obtiene o crea el carrito (status: cart) del usuario
  async function loadOrCreateCart() {
    const o = await request("/orders/cart");
    setOrder(o);
    setOrderId(o?._id || null);
    return o;
  }

  /**
   * Sincroniza items del carrito local al backend.
   * options.immediate = true → ejecuta sin debounce (útil justo antes de pending_payment).
   */
  async function syncCartItems(
    cartItems,
    { shippingCents = 0, taxCents = 0, discountCents = 0 } = {},
    options = {}
  ) {
    if (lockedOrderId) return; // ya bloqueamos una orden para pago
    if (!orderId) return;

    const itemsPayload = (cartItems || [])
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

  // Guarda snapshot de dirección en la Order (shippingAddress)
  async function saveAddresses() {
    const payload = {
      shippingAddress: {
        name: `${formData.nombre} ${formData.apellido}`.trim(),
        phone: formData.telefono,
        email: formData.email,
        line1: formData.direccion,
        city: formData.ciudad,
        region: formData.idRegion,
        country: formData.idPais,
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

  // Mueve la Order a pending_payment y devuelve referencia + orden
  async function goPending() {
    if (!orderId) throw new Error("No hay orderId");
    const resp = await request(`/orders/${orderId}/pending`, { method: "POST" });
    const pendingId = resp?.order?._id || orderId;
    setWompiReference(resp?.wompiReference || null);
    setLockedOrderId(pendingId);
    setOrder(resp?.order || order);
    return resp;
  }

  // 🔑 NUEVA FUNCIÓN: Mueve la Order de pending_payment a PENDIENTE (Pago Manual)
  async function goManualPayment(paymentMethod) {
    const idToPay = lockedOrderId || orderId;
    if (!idToPay) throw new Error("No hay orderId para completar");
    
    // Llama al nuevo endpoint del backend
    const resp = await request(`/orders/${idToPay}/manual`, { 
        method: "POST",
        body: { 
            paymentMethod: paymentMethod, 
            status: "PENDIENTE" // Estado esperado
        }
    });
    
    if (resp?.order?.status === "PENDIENTE") {
        setOrder(resp.order);
        setLockedOrderId(null); // Liberamos el lock
        return resp;
    }
    
    throw new Error(resp?.message || "No se pudo finalizar la orden como PENDIENTE.");
  }


  // 🔑 FUNCIÓN DE FLUJO: Gestiona el pago manual completo
  async function handleManualPayment(paymentMethod) {
    if (!orderId) await loadOrCreateCart();
    
    // 1. Guardar dirección
    await saveAddresses();
    
    // 2. Mover a pending_payment (Bloquea la orden)
    await goPending();
    
    // 3. Mover de pending_payment a PENDIENTE (Guarda la forma de pago y el estado final)
    await goManualPayment(paymentMethod);
    
    // 4. Mover al paso 3
    setStep(3);
  }

  // Paso 1 → Paso 2 (Solo guarda dirección y cambia de paso)
  async function handleFirstStep() {
    await saveAddresses();
    // Ya no necesitamos goPending() ni getWompiToken() aquí
    setStep(2);
  }

  // Obtiene token de Wompi (mock o real)
  async function getWompiToken() {
    const tk = await request("/wompi/token", { method: "POST" });
    const token = tk?.access_token || null;
    setAccessToken(token);
    return token;
  }

  // Pagar 3DS (Solo para Wompi, se mantiene por compatibilidad)
  async function handleFinishPayment() {
    const idToPay = lockedOrderId || orderId;
    if (!idToPay) throw new Error("No hay orderId para pagar");
    if (!accessToken) throw new Error("No hay token de Wompi");

    // Construir MMYY
    const mm = String(formDataTarjeta.mesVencimiento || "").padStart(2, "0");
    const yy4 = String(formDataTarjeta.anioVencimiento || "");
    const yy = yy4.length === 4 ? yy4.slice(-2) : yy4;

    // Si no dieron apellido, intenta derivarlo desde nombre completo
    let nombre = (formData.nombre || "").trim();
    let apellido = (formData.apellido || "").trim();
    if (!apellido && nombre.includes(" ")) {
      const parts = nombre.split(" ");
      apellido = parts.pop();
      nombre = parts.join(" ");
    }
    if (!apellido) apellido = "N/A";

    const form = {
      tarjetaCreditoDebido: {
        numeroTarjeta: (formDataTarjeta.numeroTarjeta || "").replace(/\s+/g, ""),
        cvv: formDataTarjeta.cvv,
        fechaExpiracion: `${mm}${yy}`, // MMYY
        nombreTarjetaHabiente:
          formDataTarjeta.nombreTarjetaHabiente?.trim() ||
          `${nombre} ${apellido}`.trim(),
      },

      // comprador (desde paso 1)
      nombre,
      apellido,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      codigoPostal: formData.codigoPostal,
      idPais: formData.idPais,
      idRegion: formData.idRegion,

      // 3DS redirección
      urlRedirect: window.location.origin + "/checkout",
      referencia: idToPay,
    };

    const out = await request("/wompi/payment3ds", {
      method: "POST",
      body: { token: accessToken, formData: form, orderId: idToPay },
    });

    // Si el emisor exige autenticación 3DS, Wompi devuelve una URL
    if (out?.redirectUrl) {
      window.location.assign(out.redirectUrl);
      return { redirected: true };
    }

    if (String(out?.estadoTransaccion).toUpperCase().includes("APROBA")) {
      setStep(3);
      setOrder(out.order || order);
      return out;
    }

    throw new Error(out?.message || "Pago rechazado");
  }

  return {
    // estado
    step, setStep,
    order, orderId, lockedOrderId, wompiReference, accessToken,

    // datos
    formData, handleChangeData,
    formDataTarjeta, handleChangeTarjeta,
    limpiarFormulario,

    // api
    loadOrCreateCart,
    syncCartItems,
    handleFirstStep,            // Pasa al paso 2
    handleManualPayment,        // Completa la orden a PENDIENTE
    
    // Funciones Wompi (Mantenidas)
    saveAddresses,
    goPending,
    getWompiToken,
    handleFinishPayment,
  };
}