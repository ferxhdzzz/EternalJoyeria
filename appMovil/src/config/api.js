// Configuración centralizada de la API para la app móvil
// IMPORTANTE: Solo cambiar la IP aquí para actualizar toda la app
// Esta configuración debe actualizarse según tu IP local actual

// CAMBIAR SOLO ESTA IP PARA TODA LA APP
export const BACKEND_URL = 'http://192.168.1.200:4000';

// Configuración de endpoints
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  
  // Usuarios
  CUSTOMERS_ME: '/api/customers/me',
  REGISTER: '/api/registerCustomers',
  VERIFY_EMAIL: '/api/registerCustomers/verifyCodeEmail',
  RESEND_CODE: '/api/registerCustomers/resend-code',
  
  // Recuperación de contraseña
  RECOVERY_REQUEST: '/api/recoveryPassword/requestCode',
  RECOVERY_VERIFY: '/api/recoveryPassword/verifyCode',
  RECOVERY_RESET: '/api/recoveryPassword/newPassword',
  
  // Productos
  PRODUCTS: '/api/products',
  PRODUCTS_BY_CATEGORY: '/api/products/category',
  CATEGORIES: '/api/categories',
  
  // Pedidos
  ORDERS: '/api/orders',
  ORDERS_CART: '/api/orders/cart',
  ORDERS_CART_ITEMS: '/api/orders/cart/items',
  ORDERS_CART_ADDRESSES: '/api/orders/cart/addresses',
  SALES: '/api/sales',
  
  // Pagos
  WOMPI: '/api/wompi',
  WOMPI_TOKEN: '/api/wompi/token',
  WOMPI_PAYMENT_3DS: '/api/wompi/payment3ds',
  
  // Perfil
  PROFILE_CHANGE_PASSWORD: '/api/profile/change-password',
  
  // Reviews
  REVIEWS: '/api/reviews'
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${BACKEND_URL}${endpoint}`;
};

// Función helper para hacer peticiones autenticadas con AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  // Obtener token automáticamente si no se proporciona
  const token = options.token || await AsyncStorage.getItem('authToken');
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  // Si hay body y es objeto, convertir a JSON
  if (finalOptions.body && typeof finalOptions.body === 'object' && !(finalOptions.body instanceof FormData)) {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }
  
  try {
    console.log(`🔄 [API] ${finalOptions.method} ${url}`);
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    console.log(`✅ [API] ${finalOptions.method} ${url} - Success`);
    return response;
  } catch (error) {
    console.error(`❌ [API] ${finalOptions.method} ${url} - Error:`, error.message);
    throw error;
  }
};

// Función helper específica para peticiones que devuelven JSON
export const apiRequestJson = async (endpoint, options = {}) => {
  const response = await apiRequest(endpoint, options);
  return await response.json();
};
