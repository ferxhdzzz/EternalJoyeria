// src/config/api.js
// Base URL: usa variable pública de Expo; fallback a Render (producción)
//const DEFAULT_URL = 'https://eternaljoyeria-cg5d.onrender.com';
//export const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || DEFAULT_URL).replace(/\/+$/, '');

export const BACKEND_URL = 'http://192.168.1.200:4000';

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',

  // Usuario
  CUSTOMERS_ME: '/api/customers/me',
  REGISTER: '/api/registerCustomers',
  VERIFY_EMAIL: '/api/registerCustomers/verifyCodeEmail',
  RESEND_CODE: '/api/registerCustomers/resend-code',

  // Recuperación
  RECOVERY_REQUEST: '/api/recoveryPassword/requestCode',
  RECOVERY_VERIFY: '/api/recoveryPassword/verifyCode',
  RECOVERY_RESET: '/api/recoveryPassword/newPassword',

  // Catálogo
  PRODUCTS: '/api/products',
  PRODUCTS_BY_CATEGORY: '/api/products/category',
  PRODUCTS_CHECK_PURCHASE: '/api/products/check-purchase',
  CATEGORIES: '/api/categories',

  // Órdenes / ventas
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
  REVIEWS: '/api/reviews',
};

// Construir URL completa evitando dobles barras
export const buildApiUrl = (endpoint = '') =>
  `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

// ---- Helpers de fetch ----
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cabeceras de auth (compatibles con tu backend: Authorization y x-access-token)
export const buildAuthHeaders = async (extra = {}) => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}`, 'x-access-token': token } : {}),
    ...extra,
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const token = options.token || (await AsyncStorage.getItem('authToken'));

  const headersBase = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}`, 'x-access-token': token } : {}),
    ...options.headers,
  };

  const opts = { method: 'GET', ...options, headers: headersBase };

  // Si body es objeto (y NO es FormData), enviar como JSON
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.headers = { 'Content-Type': 'application/json', ...opts.headers };
    opts.body = JSON.stringify(opts.body);
  }

  console.log(`[API] ${opts.method} ${url}`);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res;
};

export const apiRequestJson = async (endpoint, options = {}) => {
  const res = await apiRequest(endpoint, options);
  return res.json();
};
