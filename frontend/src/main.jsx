import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext"; // Asegúrate de que el path es correcto

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,

)
