// Importaciones necesarias para el componente principal de la aplicación
import React, { useEffect } from 'react'; // React y hook para efectos
import AOS from 'aos'; // Biblioteca de animaciones al hacer scroll
import 'aos/dist/aos.css'; // Estilos CSS de AOS
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Componentes de enrutamiento

// Importaciones de páginas principales
import Home from './pages/Home'; // Página de inicio
import AboutUs from './pages/AboutUs'; // Página sobre nosotros
import Products from './pages/Products'; // Página de productos
import Profile from './pages/Profile'; // Página de perfil
import './App.css'; // Estilos CSS globales de la aplicación

// Importaciones de páginas de autenticación
import Recuperacion from './pages/RecuperacionContra'; // Página de recuperación de contraseña
import Actualizacion from './pages/CambiarCont'; // Página de cambio de contraseña
import Login from './pages/Login'; // Página de inicio de sesión
import RegistroContainer from './pages/RegistroContainer'; // Página de registro

// Importaciones de páginas de comercio electrónico
import CartPage from './components/Cart/CartPage'; // Página del carrito
import HistorialPage from './pages/Historial'; // Página de historial de compras
import ProductDetail from './pages/ProductDetail'; // Página de detalle de producto
import CheckoutPage from './pages/CheckoutPage'; // Página de checkout
import { CartProvider } from './context/CartContext'; // Proveedor del contexto del carrito

// Importaciones de páginas de contacto y políticas
import Contact from './pages/ContactUs'; // Página de contacto
import DetailProduct from './pages/DetailProduct'; // Página alternativa de detalle de producto
import PrivacyPolicy from './pages/PrivacyPolicy'; // Política de privacidad
import CookiesPolicy from './pages/CookiesPolicy'; // Política de cookies
import TermsPolicy from './pages/TermsPolicy'; // Términos y condiciones
import PrivacyNotice from './pages/PrivacyNotice'; // Aviso de privacidad

// Importaciones de páginas de categorías de productos
import CategoriaCollares from './pages/CategoriaCollares'; // Página de collares
import CategoriaAretes from './pages/CategoriaAretes'; // Página de aretes
import CategoriaConjuntos from './pages/CategoriaConjuntos'; // Página de conjuntos
import CategoriaAnillos from './pages/CategoriaAnillos'; // Página de anillos

// Importaciones de páginas adicionales
import PreguntasFrecuentes from './pages/PreguntasFrecuentes'; // Página de FAQ
import ScrollToTop from './components/ScrollToTop'; // Componente para scroll al inicio
import Blog from './pages/Blog'; // Página del blog
import NotFound from './pages/NotFound'; // Página de error 404


// Componente principal de la aplicación - Actúa como contenedor para todos los demás componentes
function App() {
  // Efecto para inicializar las animaciones AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación reducida
      once: true, // La animación solo ocurre una vez
      offset: 50, // Reducir el offset para que la animación comience antes
      easing: 'ease-out', // Cambiar la curva de animación para que sea más suave
      delay: 0, // Sin retraso en las animaciones
    });
  }, []); // Array vacío significa que solo se ejecuta al montar el componente

  // El return contiene el JSX que se renderizará en el DOM
  return (
    <CartProvider> {/* Proveedor del contexto del carrito - Envuelve toda la aplicación */}
      <Router> {/* Router principal de la aplicación */}
        <ScrollToTop /> {/* Componente para hacer scroll al inicio al cambiar de página */}
        <Routes> {/* Contenedor de todas las rutas de la aplicación */}

          {/* Ruta principal - Página de inicio */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de autenticación */}
          <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/cambiar" element={<Actualizacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroContainer />} />

          {/* Rutas de información de la empresa */}
          <Route path="/sobre-nosotros" element={<AboutUs />} />
          
          {/* Rutas de productos */}
          <Route path="/productos" element={<Products />} />
          <Route path="/categoria" element={<Products />} />
          
          {/* Rutas de categorías específicas */}
          <Route path="/categoria/collares" element={<CategoriaCollares />} />
          <Route path="/categoria/aretes" element={<CategoriaAretes />} />
          <Route path="/categoria/conjuntos" element={<CategoriaConjuntos />} />
          <Route path="/categoria/anillos" element={<CategoriaAnillos />} />
          
          {/* Rutas de productos individuales */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/detalle-producto/:id" element={<DetailProduct />} />
          
          {/* Rutas de perfil de usuario */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/perfil" element={<Profile />} />
          
          {/* Rutas del carrito de compras */}
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<CartPage />} />
          
          {/* Rutas de historial y checkout */}
          <Route path="/historial" element={<HistorialPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Rutas de contacto y políticas */}
          <Route path="/contactanos" element={<Contact />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/terminos" element={<TermsPolicy />} />
          <Route path="/aviso-privacidad" element={<PrivacyNotice />} />
          
          {/* Rutas adicionales */}
          <Route path="/faq" element={<PreguntasFrecuentes />} />
          <Route path="/blog" element={<Blog />} />

          {/* Ruta de error 404 - Debe ir al final para capturar todas las rutas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

// Exporta el componente App para ser usado en otras partes de la aplicación, como en index.js
export default App;
