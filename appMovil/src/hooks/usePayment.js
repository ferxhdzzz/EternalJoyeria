// src/hooks/usePayment.js
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

const OBJID = /^[a-f\d]{24}$/i;

export default function usePayment() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  
  // Estados de Order en servidor
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);             // carrito actual (status: cart)
  const [lockedOrderId, setLockedOrderId] = useState(null); // orden "congelada" en pending_payment
  const [wompiReference, setWompiReference] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL del backend viene de la configuración centralizada

  // Datos del formulario (envío)
  const [formData, setFormData] = useState({
    nombre: user?.firstName || '',
    apellido: user?.lastName || '',
    email: user?.email || '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    telefono: user?.phone || '',
    idPais: 'SV',
    idRegion: 'SV-SS',
  });

  // Datos de tarjeta
  const [formDataTarjeta, setFormDataTarjeta] = useState({
    nombreTarjetaHabiente: '',
    numeroTarjeta: '',
    cvv: '',
    mesVencimiento: '',
    anioVencimiento: '',
  });

  // debounce para syncCartItems
  const syncTimer = useRef(null);

  const handleChangeData = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTarjeta = (name, value) => {
    setFormDataTarjeta((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: user?.firstName || '',
      apellido: user?.lastName || '',
      email: user?.email || '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      telefono: user?.phone || '',
      idPais: 'SV',
      idRegion: 'SV-SS',
    });
    setFormDataTarjeta({
      nombreTarjetaHabiente: '',
      numeroTarjeta: '',
      cvv: '',
      mesVencimiento: '',
      anioVencimiento: '',
      displayValue: '', // Limpiar también el valor de visualización
    });
    setStep(1);
    setOrder(null);
    setOrderId(null);
    setLockedOrderId(null);
    setWompiReference(null);
    setAccessToken(null);
    setLoading(false);
    if (syncTimer.current) clearTimeout(syncTimer.current);
  };

  // Función para resetear el estado de pago y permitir reintentos
  const resetPaymentState = async () => {
    try {
      console.log('🔄 Reseteando estado de pago...');
      setLockedOrderId(null);
      setWompiReference(null);
      setAccessToken(null);
      setStep(1);
      
      // Crear un nuevo carrito
      await loadOrCreateCart();
      console.log('✅ Estado de pago reseteado correctamente');
    } catch (error) {
      console.error('❌ Error al resetear estado de pago:', error);
      throw error;
    }
  };

  /* === API CALLS === */

  // Función helper para hacer requests autenticadas
  const apiFetch = async (endpoint, options = {}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      // Usar buildApiUrl para construir la URL correctamente
      const url = buildApiUrl(endpoint);
      
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      };

      if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
      }

      console.log(`🔄 [API] ${config.method} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ [API] ${config.method} ${url} - HTTP ${response.status}:`, errorData);
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ [API] ${config.method} ${url} - Success`);
      return data;
    } catch (error) {
      console.error(`❌ [API] ${options.method || 'GET'} ${endpoint} - Error:`, error.message);
      throw error;
    }
  };

  // Obtiene o crea el carrito (status: cart) del usuario
  const loadOrCreateCart = async () => {
    try {
      setLoading(true);
      // Usar directamente getOrCreateCart que es idempotente
      // Este endpoint automáticamente crea el carrito si no existe
      const o = await apiFetch(API_ENDPOINTS.ORDERS_CART);
      
      if (!o?._id) {
        throw new Error('No se pudo obtener o crear el carrito');
      }
      
      setOrder(o);
      setOrderId(o._id);
      return o;
    } catch (error) {
      console.error('Error al cargar/crear el carrito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sincroniza items del carrito local al backend.
   * options.immediate = true → ejecuta sin debounce (útil justo antes de pending_payment).
   */
  const syncCartItems = async (
    cartItems,
    { shippingCents = 0, taxCents = 0, discountCents = 0 } = {},
    options = {}
  ) => {
    if (lockedOrderId) return; // ya bloqueamos una orden para pago
    if (!orderId) return;

    const itemsPayload = (cartItems || [])
      .filter((it) => it._id && OBJID.test(String(it._id)) && Number(it.quantity) > 0)
      .map((it) => ({
        productId: String(it._id),
        quantity: Number(it.quantity || 0),
        variant: it.size ? { size: it.size } : undefined,
      }));

    const exec = async () => {
      try {
        console.log('🔄 Sincronizando carrito con payload:', {
          items: itemsPayload,
          shippingCents,
          taxCents,
          discountCents,
          orderId
        });
        
        const updated = await apiFetch(API_ENDPOINTS.ORDERS_CART_ITEMS, {
          method: 'PUT',
          body: { items: itemsPayload, shippingCents, taxCents, discountCents },
        });
        
        console.log('✅ Carrito sincronizado exitosamente:', updated._id);
        setOrder(updated);
        setOrderId(updated?._id || orderId);
        return updated;
      } catch (error) {
        console.error('❌ Error syncing cart items:', error);
        throw new Error(`Error sincronizando carrito: ${error.message}`);
      }
    };

    if (options.immediate) return exec();

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(exec, 500);
  };

  // Guarda snapshot de dirección en la Order (shippingAddress)
  const saveAddresses = async () => {
    try {
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
      
      const updated = await apiFetch(API_ENDPOINTS.ORDERS_CART_ADDRESSES, {
        method: 'PUT',
        body: payload,
      });
      
      setOrder(updated);
      setOrderId(updated?._id || orderId);
      return updated;
    } catch (error) {
      console.error('Error saving addresses:', error);
      throw error;
    }
  };

  // Mueve la Order a pending_payment y devuelve referencia + orden
  const goPending = async () => {
    if (!orderId) throw new Error('No hay orderId');
    
    try {
      const resp = await apiFetch(`${API_ENDPOINTS.ORDERS}/${orderId}/pending`, { method: 'POST' });
      const pendingId = resp?.order?._id || orderId;
      setWompiReference(resp?.wompiReference || null);
      setLockedOrderId(pendingId);
      setOrder(resp?.order || order);
      return resp;
    } catch (error) {
      console.error('Error setting pending payment:', error);
      throw error;
    }
  };

  // Obtiene token de Wompi (mock o real)
  const getWompiToken = async () => {
    try {
      const tk = await apiFetch(API_ENDPOINTS.WOMPI_TOKEN, { method: 'POST' });
      const token = tk?.access_token || null;
      setAccessToken(token);
      return token;
    } catch (error) {
      console.error('Error getting Wompi token:', error);
      throw error;
    }
  };

  // Paso 1 → Paso 2
  const handleFirstStep = async () => {
    try {
      setLoading(true);
      await saveAddresses();
      await goPending();
      await getWompiToken();
      setStep(2);
    } catch (error) {
      console.error('Error in first step:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Pagar 3DS
  const handleFinishPayment = async () => {
    const idToPay = lockedOrderId || orderId;
    if (!idToPay) throw new Error('No hay orderId para pagar');
    if (!accessToken) throw new Error('No hay token de Wompi');

    try {
      setLoading(true);

      // Validaciones previas
      if (!formDataTarjeta.numeroTarjeta || formDataTarjeta.numeroTarjeta.replace(/\s/g, '').length < 13) {
        throw new Error('Número de tarjeta inválido');
      }
      if (!formDataTarjeta.cvv || formDataTarjeta.cvv.length < 3) {
        throw new Error('CVV inválido');
      }
      if (!formDataTarjeta.mesVencimiento || !formDataTarjeta.anioVencimiento) {
        throw new Error('Fecha de vencimiento requerida');
      }

      // Construir MMYY
      const mm = String(formDataTarjeta.mesVencimiento || '').padStart(2, '0');
      const yy4 = String(formDataTarjeta.anioVencimiento || '');
      const yy = yy4.length === 4 ? yy4.slice(-2) : yy4;

      console.log('🔄 Validando datos de tarjeta:', {
        numeroTarjeta: `****${formDataTarjeta.numeroTarjeta.slice(-4)}`,
        fechaExpiracion: `${mm}${yy}`,
        cvvLength: formDataTarjeta.cvv.length
      });

      // Si no dieron apellido, intenta derivarlo desde nombre completo
      let nombre = (formData.nombre || '').trim();
      let apellido = (formData.apellido || '').trim();
      if (!apellido && nombre.includes(' ')) {
        const parts = nombre.split(' ');
        apellido = parts.pop();
        nombre = parts.join(' ');
      }
      if (!apellido) apellido = 'N/A';

      const form = {
        tarjetaCreditoDebido: {
          numeroTarjeta: (formDataTarjeta.numeroTarjeta || '').replace(/\s+/g, ''),
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

        // 3DS redirección (para app móvil, podríamos usar deep linking)
        urlRedirect: 'eternaljoyeria://payment-success',
        referencia: idToPay,
      };

      console.log('🔄 Enviando datos de pago:', {
        orderId: idToPay,
        numeroTarjeta: form.tarjetaCreditoDebido.numeroTarjeta.slice(-4),
        fechaExpiracion: form.tarjetaCreditoDebido.fechaExpiracion,
        email: form.email
      });

      const out = await apiFetch(API_ENDPOINTS.WOMPI_PAYMENT_3DS, {
        method: 'POST',
        body: { token: accessToken, formData: form, orderId: idToPay },
      });

      console.log('✅ Respuesta del pago:', out);

      // En modo mock, verificar diferentes respuestas posibles
      if (out?.success || 
          String(out?.estadoTransaccion || '').toUpperCase().includes('APROBA') ||
          String(out?.status || '').toUpperCase().includes('SUCCESS') ||
          out?.transactionState === 'APPROVED') {
        setStep(3);
        setOrder(out.order || order);
        return out;
      }

      // Si hay un mensaje específico, usarlo
      const errorMessage = out?.message || out?.error || 'Pago rechazado o pendiente';
      throw new Error(errorMessage);
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Si el error indica que ya fue pagado, sugerir reset
      if (error.message && (
          error.message.includes('ya fue pagado') ||
          error.message.includes('already paid') ||
          error.message.includes('duplicate') ||
          error.message.includes('DUPLICATED')
        )) {
        console.log('⚠️ Orden ya procesada, sugiriendo reset...');
        // En este caso, podríamos automáticamente resetear
        // o lanzar un error específico para que la UI maneje
        throw new Error('Esta orden ya fue procesada. Por favor, inicia un nuevo proceso de pago.');
      }
      
      // Si es error 500, dar más contexto
      if (error.message.includes('HTTP 500') || error.message.includes('Error al procesar pago 3DS')) {
        console.log('❌ Error 500 del servidor - problema en backend');
        throw new Error('Error en el servidor. Por favor, verifica que el backend esté funcionando correctamente y que el modo mock esté configurado.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // estado
    step,
    setStep,
    order,
    orderId,
    lockedOrderId,
    wompiReference,
    accessToken,
    loading,

    // datos
    formData,
    handleChangeData,
    formDataTarjeta,
    handleChangeTarjeta,
    limpiarFormulario,

    // api
    loadOrCreateCart,
    syncCartItems,
    saveAddresses,
    goPending,
    getWompiToken,
    handleFirstStep,
    handleFinishPayment,
    resetPaymentState,
  };
}
