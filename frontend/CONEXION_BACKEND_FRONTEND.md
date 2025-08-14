# 🔗 CONEXIÓN BACKEND - FRONTEND - PERFIL

## 📋 **RESUMEN DE LO QUE HICIMOS**

Conectamos el backend con el frontend del perfil usando **fetch normal** (sin librerías complicadas). Ahora el perfil puede:

- ✅ **Cargar datos** desde la base de datos
- ✅ **Actualizar información** (nombre, email, teléfono)
- ✅ **Subir fotos de perfil** al servidor
- ✅ **Mostrar mensajes** de éxito/error
- ✅ **Manejar errores** de conexión

---

## 🚀 **PASOS PARA PROBAR LA CONEXIÓN**

### **PASO 1: Verificar que el backend esté corriendo**
```bash
# En la carpeta backend
cd backend
npm start
```
**El backend debe estar corriendo en el puerto 4000** ⚠️ **IMPORTANTE: Puerto 4000, NO 3000**

### **PASO 2: Verificar que el frontend esté corriendo**
```bash
# En la carpeta frontend
cd frontend
npm run dev
```
**El frontend debe estar corriendo en el puerto 5173**

### **PASO 3: Abrir la página de perfil**
Ve a: `http://localhost:5173/profile`

---

## 🔧 **CONFIGURACIÓN IMPORTANTE**

### **1. Cambiar el ID del usuario**
En `frontend/src/pages/Profile.jsx`, línea 20:
```javascript
// Cambia esto por el ID real del usuario logueado
const userId = '64f8b2c1a2b3c4d5e6f7g8h9';
```

**Para obtener un ID real:**
1. Ve a tu base de datos MongoDB
2. Busca en la colección `customers`
3. Copia el `_id` de un usuario existente

### **2. Verificar la URL del backend**
En `frontend/src/config/backend.js`:
```javascript
export const BACKEND_URL = 'http://localhost:4000'; // Puerto correcto del backend
```

---

## 🧪 **PROBAR LA CONEXIÓN**

### **Opción 1: Usar las funciones de prueba**
En la consola del navegador:
```javascript
// Importar las funciones de prueba
import { testBackendConnection, testGetCustomerById } from './src/test-connection.js'

// Probar conexión básica
testBackendConnection()

// Probar obtener un cliente específico
testGetCustomerById('ID_REAL_DEL_USUARIO')
```

### **Opción 2: Verificar en la consola del navegador**
1. Abre la página de perfil
2. Presiona F12 (DevTools)
3. Ve a la pestaña Console
4. Deberías ver mensajes de conexión detallados

---

## 📁 **ARCHIVOS QUE CREAMOS/MODIFICAMOS**

### **Backend:**
- ✅ `backend/src/routes/customers.js` - Agregamos ruta GET por ID
- ✅ `backend/src/controllers/customersController.js` - Agregamos función getCustomerById
- ✅ `backend/app.js` - Agregamos ruta de prueba `/api/test`

### **Frontend:**
- ✅ `frontend/src/config/backend.js` - Configuración de URLs (puerto 4000)
- ✅ `frontend/src/hooks/useProfile.js` - Hook personalizado para el perfil
- ✅ `frontend/src/pages/Profile.jsx` - Página actualizada para usar el backend
- ✅ `frontend/src/test-connection.js` - Funciones de prueba

---

## 🚨 **PROBLEMAS COMUNES Y SOLUCIONES**

### **Error: "CORS error"**
**Solución:** Verifica que en `backend/app.js` tengas:
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
```

### **Error: "Cannot connect to backend"**
**Solución:** 
1. Verifica que el backend esté corriendo en el puerto 4000
2. Verifica el puerto en `frontend/src/config/backend.js`
3. Verifica que no haya firewall bloqueando

### **Error: "401 Unauthorized"**
**Solución:** 
1. Verifica que el usuario esté logueado
2. Verifica que el token de autenticación sea válido
3. Verifica que el middleware `validateAuthToken` esté funcionando

### **Error: "404 Not Found"**
**Solución:**
1. Verifica que la ruta `/api/customers/:id` esté configurada
2. Verifica que el ID del usuario sea válido
3. Verifica que el usuario exista en la base de datos

---

## 🎯 **PRÓXIMOS PASOS (OPCIONAL)**

### **1. Agregar autenticación real**
- Conectar con el sistema de login existente
- Obtener el ID del usuario del contexto de autenticación
- Manejar tokens JWT

### **2. Agregar validaciones**
- Validar campos antes de enviar al backend
- Mostrar errores específicos por campo
- Agregar confirmaciones antes de actualizar

### **3. Agregar más funcionalidades**
- Cambiar contraseña
- Eliminar cuenta
- Exportar datos del perfil

---

## 📞 **SI ALGO NO FUNCIONA**

1. **Verifica la consola del navegador** (F12 → Console)
2. **Verifica la consola del backend** (terminal donde corre el backend)
3. **Verifica que todos los archivos estén guardados**
4. **Reinicia tanto el backend como el frontend**
5. **Verifica que las URLs y puertos sean correctos** (puerto 4000 para backend)

---

## 🎉 **¡LISTO!**

Tu perfil ahora está conectado con el backend usando fetch normal. Puedes:
- Cargar datos reales desde la base de datos
- Actualizar información del usuario
- Subir fotos de perfil
- Ver mensajes de éxito/error en tiempo real

**¡Todo funcionando con código simple y fácil de entender!** 🚀

**⚠️ RECUERDA: El backend corre en el puerto 4000, no en el 3000** 