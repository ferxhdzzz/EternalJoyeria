// Importaciones necesarias para el punto de entrada de la aplicación
import { StrictMode } from 'react' // Modo estricto de React para detectar problemas
import { createRoot } from 'react-dom/client' // Método moderno para renderizar React
import './index.css' // Estilos CSS globales de la aplicación
import App from './App.jsx' // Componente principal de la aplicación

// Crear y renderizar la aplicación React en el elemento con id 'root'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
