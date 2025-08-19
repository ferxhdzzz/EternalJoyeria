# Eternal Joyería - Aplicación Móvil y Web

Este proyecto incluye tanto la aplicación móvil como la interfaz web para Eternal Joyería.

##  Funcionalidades Implementadas

###  Aplicación Móvil
-  **Login funcional** - Inicio de sesión con validación
-  **Perfil funcional** - Gestión completa del perfil de usuario
-  **Logout funcional** - Cierre de sesión con confirmación
-  **Navegación entre pantallas** - Sistema de navegación completo
-  **Gestión de estado** - Contexto de autenticación funcional
-  **Persistencia de datos** - Almacenamiento local con AsyncStorage

###  Interfaz Web
- **Perfil funcional** - Gestión completa del perfil web
- **Logout funcional** - Cierre de sesión integrado
-  **Contexto de autenticación** - Manejo de estado de usuario
-  **Hooks personalizados** - Login y logout funcionales

##  Instalación de la Aplicación Móvil

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app en tu dispositivo móvil

### Pasos de instalación

1. **Navegar al directorio de la app móvil:**
   ```bash
   cd appMovil
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

4. **Escanear el código QR** con la app Expo Go en tu dispositivo móvil

### Dependencias principales
- React Native con Expo
- React Navigation para navegación
- AsyncStorage para persistencia de datos
- Expo Image Picker para selección de fotos
- Linear Gradient para efectos visuales

##  Instalación de la Interfaz Web

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:** `http://localhost:5173`

## 🔧 Configuración del Backend

Asegúrate de que el backend esté ejecutándose y configurado correctamente. La aplicación web se conecta al backend a través de la configuración en `frontend/src/config/backend.js`.

## 📱 Uso de la Aplicación Móvil

### Flujo de autenticación:
1. **Pantallas de bienvenida** - Introducción a la app
2. **Login** - Inicio de sesión con email y contraseña
3. **Pantalla principal** - Productos organizados por categorías
4. **Perfil** - Gestión de datos personales y foto de perfil
5. **Logout** - Cierre de sesión con confirmación

### Características del perfil:
-  Edición de datos personales (nombre, email, teléfono)
-  Cambio de foto de perfil
-  Configuración de notificaciones
-  Gestión de idioma y moneda
-  Acceso a políticas y términos

##  Uso de la Interfaz Web

### Funcionalidades del perfil:
-  Edición de información personal
-  Cambio de foto de perfil
-  Gestión de dirección completa
-  Configuración de notificaciones
-  Acceso a historial de pedidos
- Logout funcional

## 🛠️ Estructura del Proyecto

```
EternalJoyeria/
├── appMovil/                 # Aplicación móvil React Native
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # Contexto de autenticación
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── navigation/       # Sistema de navegación
│   │   └── screens/          # Pantallas de la aplicación
│   └── App.js               # Punto de entrada principal
├── frontend/                 # Interfaz web React
│   ├── src/
│   │   ├── components/       # Componentes web
│   │   ├── context/          # Contexto de autenticación
│   │   ├── hooks/            # Hooks personalizados
│   │   └── pages/            # Páginas de la aplicación
│   └── package.json
└── backend/                  # API del backend
```

##  Autenticación


### App Móvil
- **Contexto de autenticación** con AsyncStorage
- **Persistencia de sesión** entre reinicios de la app
- **Validación de formularios** en tiempo real
- **Manejo de errores** con alertas nativas

## Comandos para ejecutar la app movil
-cd nombre del proyecto
-npx expo start
-presionamos a para iniciar y r para recargar


## Comandos para ejecutar el backend
**inicializar el proyecto** : npm init-y

**ejecutar** : node index.js


## Comandos para ejecutar el frontend
**inicializar el proyecto** : npm create vite@latest

**ejecutar** : npm run dev



## Librerias instaladas en el backend


- express

- mongoose

- dotenv

- nodemailer

- crypto

- jsonwebtoken

- bcryptjs

- cookie-parser

- multer-storage-cloudinary

- multer

- cloudinary

- cors

 
 ## Librerias instaladas en el frontend


- framer-motion

- gsap


### Web
- **Contexto de autenticación** con cookies del backend
- **Hooks personalizados** para login/logout
- **Manejo de estado** centralizado
- **Redirección automática** después del logout

##  Pruebas de la Aplicación Móvil

1. **Instalar dependencias** en `appMovil/`
2. **Ejecutar** `npm start`
3. **Probar funcionalidades:**
   - Login con credenciales válidas
   - Navegación entre pantallas
   - Edición de perfil
   - Cambio de foto
   - Logout y confirmación

##  Pruebas de la Interfaz Web

1. **Instalar dependencias** en `frontend/`
2. **Ejecutar** `npm run dev`
3. **Probar funcionalidades:**
   - Navegación al perfil
   - Edición de campos
   - Cambio de foto
   - Logout funcional

##  Solución de Problemas

### App Móvil
- **Error de dependencias:** Ejecutar `npm install` en `appMovil/`
- **Error de Expo:** Verificar versión de Node.js (16+)
- **Error de AsyncStorage:** Verificar instalación de `@react-native-async-storage/async-storage`

### Web
- **Error de dependencias:** Ejecutar `npm install` en `frontend/`
- **Error de conexión:** Verificar configuración del backend
- **Error de autenticación:** Verificar cookies y sesión

##  Soporte

Para problemas técnicos o preguntas sobre la implementación, revisa:
1. Los logs de la consola
2. La configuración del backend
3. Las dependencias instaladas
4. La versión de Node.js


## Librerias instaladas en la app Movil
npm install -g expo-cli 

  ## Nomenclatura utlizada para backend y frontend
camelCase







