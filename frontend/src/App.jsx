import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';
import './App.css'; // Global styles
import Recuperacion from './pages/RecuperacionContra';
import Actualizacion from './pages/CambiarCont';
import Login from './pages/Login';
import RegistroContainer from './pages/RegistroContainer';
import CartPage from './components/Cart/CartPage';
import HistorialPage from './pages/Historial';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import ContactUsPage from './pages/ContactUs';
import DetailProduct from './pages/DetailProduct';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import TermsPolicy from './pages/TermsPolicy';
import PrivacyNotice from './pages/PrivacyNotice';
import CategoriaCollares from './pages/CategoriaCollares';
import CategoriaAretes from './pages/CategoriaAretes';
import CategoriaConjuntos from './pages/CategoriaConjuntos';
import CategoriaAnillos from './pages/CategoriaAnillos';


// This is the main component of the application, which acts as a container for all other components.
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación reducida
      once: true, // La animación solo ocurre una vez
      offset: 50, // Reducir el offset para que la animación comience antes
      easing: 'ease-out', // Cambiar la curva de animación para que sea más suave
      delay: 0, // Sin retraso en las animaciones
    });
  }, []);

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    <CartProvider>
      <Router>
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<CartPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contactanos" element={<ContactUsPage />} />
        <Route path="/detalle-producto/:id" element={<DetailProduct />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/terminos" element={<TermsPolicy />} />
        <Route path="/aviso-privacidad" element={<PrivacyNotice />} />

        {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
      </Routes>
      </Router>
    </CartProvider>
  );
}

// Exports the App component to be used in other parts of the application, such as index.js.
export default App;
