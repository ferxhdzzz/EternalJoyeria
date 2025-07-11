import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Recuperacion from './pages/RecuperacionContra';
import Actualizacion from './pages/CambiarCont';
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

import PublicRoute from './components/PublicRoute'; // Protector de rutas públicas

import './App.css'; // Estilos globales

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      easing: 'ease-out',
      delay: 0,
    });
  }, []);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/cambiar" element={<Actualizacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroContainer />} />

          <Route path="/sobre-nosotros" element={<AboutUs />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/categoria" element={<Products />} />
          <Route path="/categoria/collares" element={<CategoriaCollares />} />
          <Route path="/categoria/aretes" element={<CategoriaAretes />} />
          <Route path="/categoria/conjuntos" element={<CategoriaConjuntos />} />
          <Route path="/categoria/anillos" element={<CategoriaAnillos />} />
          <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/perfil" element={<Profile />} />

          {/* Rutas protegidas con PublicRoute */}
          
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

          <Route path="/carrito" element={<CartPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<CartPage />} />

          <Route path="/contactanos" element={<Contact />} />
          <Route path="/detalle-producto/:id" element={<DetailProduct />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/terminos" element={<TermsPolicy />} />
          <Route path="/aviso-privacidad" element={<PrivacyNotice />} />
          <Route path="/faq" element={<PreguntasFrecuentes />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
