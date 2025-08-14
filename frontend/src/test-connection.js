// Archivo de prueba para verificar la conexión con el backend
// Puedes ejecutar esto en la consola del navegador para probar

import { API_URL } from './config/backend.js';

// Función para probar la conexión
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Probando conexión con el backend...');
    console.log('📍 URL del backend:', API_URL);
    
    // Probar obtener clientes (esto requiere autenticación)
    const response = await fetch(`${API_URL}/customers`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa!', data);
      return true;
    } else {
      console.log('⚠️ Respuesta del servidor:', response.status, response.statusText);
      if (response.status === 401) {
        console.log('🔒 Necesitas autenticación para acceder a esta ruta');
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
};

// Función para probar con un ID específico
export const testGetCustomerById = async (customerId) => {
  try {
    console.log(`🔍 Probando obtener cliente con ID: ${customerId}`);
    
    const response = await fetch(`${API_URL}/customers/${customerId}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cliente obtenido exitosamente:', data);
      return data;
    } else {
      console.log('⚠️ Error al obtener cliente:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

// Función para probar actualización
export const testUpdateCustomer = async (customerId, updateData) => {
  try {
    console.log(`🔍 Probando actualizar cliente con ID: ${customerId}`);
    console.log('📝 Datos a actualizar:', updateData);
    
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cliente actualizado exitosamente:', data);
      return data;
    } else {
      console.log('⚠️ Error al actualizar cliente:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

// Para usar en la consola del navegador:
// 1. Importa las funciones: import { testBackendConnection, testGetCustomerById, testUpdateCustomer } from './test-connection.js'
// 2. Prueba la conexión: testBackendConnection()
// 3. Prueba obtener un cliente: testGetCustomerById('ID_DEL_CLIENTE')
// 4. Prueba actualizar: testUpdateCustomer('ID_DEL_CLIENTE', { firstName: 'Nuevo Nombre' }) 