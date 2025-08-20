// src/App.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';

import Recuperacion from './pages/RecuperacionContra';
import VerificarCodigo from './pages/VerificarCodigo';   // ← nueva import
import Actualizacion from './pages/CambiarCont';          // CambiarCont.jsx

import Login from './pages/Login';
import RegistroContainer from './pages/RegistroContainer';
import CartPage from './components/Cart/CartPage';
import HistorialPage from './pages/Historial';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import Contact from './pages/ContactUs';
import DetailProduct from './pages/DetailProduct';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import TermsPolicy from './pages/TermsPolicy';
import PrivacyNotice from './pages/PrivacyNotice';
import CategoriaCollares from './pages/CategoriaCollares';
import CategoriaAretes from './pages/CategoriaAretes';
import CategoriaConjuntos from './pages/CategoriaConjuntos';
import CategoriaAnillos from './pages/CategoriaAnillos';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import ScrollToTop from './components/ScrollToTop';
import Blog from './pages/Blog';

import HistorialReviews from './pages/HistReviews';

import CategoryProducts from './pages/CategoryProducts';
import Error404 from './pages/Error404';


import PublicRoute from './components/PublicRoute';

import './App.css';

// Guard sencillo para /cambiar (usa sessionStorage set en VerificarCodigo)
function GuardCambio({ children }) {
  const ok = typeof window !== 'undefined' && sessionStorage.getItem('rp_verified') === '1';
  return ok ? children : <Navigate to="/recuperacion" replace />;
}

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 50, easing: 'ease-out', delay: 0 });
  }, []);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Flujo recuperación */}
          <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
          <Route
            path="/cambiar"
            element={
              <GuardCambio>
                <Actualizacion />
              </GuardCambio>
            }
          />

          {/* Auth / registro */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroContainer />} />

          {/* Catálogo / info públicas */}
          <Route path="/sobre-nosotros" element={<Profile />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/categoria" element={<Products />} />
          <Route path="/categoria/collares" element={<CategoriaCollares />} />
          <Route path="/categoria/aretes" element={<CategoriaAretes />} />
          <Route path="/categoria/conjuntos" element={<CategoriaConjuntos />} />
          <Route path="/categoria/anillos" element={<CategoriaAnillos />} />
          <Route path="/category/:id" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Protegidas */}
          <Route path="/perfil" element={<Profile />} />
          <Route
            path="/historial"
            element={
              <PublicRoute>
                <HistorialPage />
              </PublicRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PublicRoute>
                <CheckoutPage />
              </PublicRoute>
            }
          />

   <Route
            path="/histReview"
            element={
              <PublicRoute>
                <HistorialReviews />
              </PublicRoute>
            }
          />


          {/* Carrito / otros */}
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<CartPage />} />

          <Route path="/contactanos" element={<Contact />} />
          <Route path="/detalle-producto/:id" element={<ProductDetail />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/terminos" element={<TermsPolicy />} />
          <Route path="/aviso-privacidad" element={<PrivacyNotice />} />
          <Route path="/faq" element={<PreguntasFrecuentes />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
