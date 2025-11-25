import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🔑 Recursos de traducción (ES y EN)
// Puedes añadir más claves y traducciones a medida que las necesites
const resources = {
  es: {
    translation: {
      "Nav": {
        "Products": "Productos",
        "AboutUs": "Sobre Nosotros",
        "ContactUs": "Contáctanos",
        "Login": "Iniciar Sesión",
        "Profile": "Perfil",
        "SelectCountry": "Seleccionar País",
        "Cart": "Carrito de Compras"
      },
      "ProductsPage": {
        "PromoTitleLine1": "Disfruta las",
        "PromoTitleLine2": "mejores",
        "PromoTitleLine3": "promociones",
        "NoProductsAvailable": "No hay productos disponibles para {{region}}",
        "ComeBackSoon": "Vuelve pronto para ver nuestras novedades"
      },
      "Global": {
        "AddToCart": "Añadir al Carrito"
      }
    }
  },
  en: {
    translation: {
      "Nav": {
        "Products": "Products",
        "AboutUs": "About Us",
        "ContactUs": "Contact Us",
        "Login": "Login",
        "Profile": "Profile",
        "SelectCountry": "Select Country",
        "Cart": "Shopping Cart"
      },
      "ProductsPage": {
        "PromoTitleLine1": "Enjoy the",
        "PromoTitleLine2": "best",
        "PromoTitleLine3": "promotions",
        "NoProductsAvailable": "No products available for {{region}}",
        "ComeBackSoon": "Check back soon for new arrivals"
      },
      "Global": {
        "AddToCart": "Add to Cart"
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador, aunque lo sobrescribiremos con el país
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    // Usamos 'es' como idioma predeterminado si no se detecta nada o falla
    lng: 'es', 
    fallbackLng: 'es',

    interpolation: {
      escapeValue: false // React ya escapa por defecto
    },
    // Regla de mapeo para tu contexto de país
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'htmlTag'],
    }
  });

export default i18n;