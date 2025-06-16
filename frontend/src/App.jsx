<<<<<<< HEAD
import React from 'react'; // Imports the React library, necessary for creating React components.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Imports components from react-router-dom for handling routing.
import Home from './pages/Home'; // Imports the Home page component.
import AboutUs from './pages/AboutUs'; // Imports the About Us page component.
import Products from './pages/Products'; // Imports the Products page component.
import Profile from './pages/Profile'; // Imports the Profile page component.
import './App.css'; // Imports the global stylesheet for the application.
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Profile from './pages/Profile';
import './App.css'; // Global styles
import Recuperacion from './pages/RecuperacionContra';
import Actualizacion from './pages/CambiarCont';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Cart';
import Hitorial from './pages/Historial';



>>>>>>> master

// This is the main component of the application, which acts as a container for all other components.
function App() {
  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // The Router component provides the routing context for the application.
    <Router>
      {/* The Routes component is a container for a collection of Route components. */}
      <Routes>
<<<<<<< HEAD
        {/* Each Route component maps a URL path to a specific component. */}
        <Route path="/" element={<Home />} /> {/* This route maps the root URL to the Home component. */}
        <Route path="/sobre-nosotros" element={<AboutUs />} /> {/* This route maps the /sobre-nosotros URL to the AboutUs component. */}
        <Route path="/products" element={<Products />} /> {/* This route maps the /products URL to the Products component. */}
        <Route path="/profile" element={<Profile />} /> {/* This route maps the /profile URL to the Profile component. */}
        {/* This is a commented-out example of how to define other routes. */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/products" element={<Products />} /> */}
=======

        <Route path="/" element={<Home />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
          <Route path="/cambiar" element={<Actualizacion />} />
          <Route path="/login" element={<Login />} />
             <Route path="/registro" element={<Registro />} />


        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
                <Route path="/shop" element={<Carrito />} />
                  <Route path="/historial" element={<Hitorial />} />
        {/* Define other routes here, e.g.:
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> 
        */}
>>>>>>> master
      </Routes>
    </Router>
  );
}

// Exports the App component to be used in other parts of the application, such as index.js.
export default App;
