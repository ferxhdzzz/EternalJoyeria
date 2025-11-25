// src/i18n/Translations.js

export const translations = {
  es: {
    // 🔑 NAV BAR
    "Nav_Products": "Productos",
    "Nav_AboutUs": "Sobre Nosotros",
    "Nav_ContactUs": "Contáctanos",
    "Nav_Login": "Iniciar Sesión",
    "Nav_Profile": "Perfil",
    "Nav_SelectCountry": "Seleccionar País",
    "Nav_Cart": "Carrito de Compras",

    // 🔑 LANDING / MODAL
    "Welcome": "¿Desde dónde nos visitas?",
    "SelectCountry": "Selecciona tu país para ver el catálogo y el idioma correctos.",
    "ChangeLater": "Puedes cambiar esta preferencia más adelante en el menú.",
    "ElSalvador": "🇸🇻 El Salvador — Español",
    "USA": "🇺🇸 United States — English",
    
    // 🔑 PRODUCTS PAGE (Ejemplo)
    "Products_PromoTitleLine1": "Disfruta las",
    "Products_PromoTitleLine2": "mejores",
    "Products_PromoTitleLine3": "promociones",
    "Products_NoProductsAvailable": "No hay productos disponibles para {{region}}",
    "Products_ComeBackSoon": "Vuelve pronto para ver nuestras novedades",

    // 🔑 GLOBAL
    "AddToCart": "Añadir al Carrito",
  },
  en: {
    // 🔑 NAV BAR
    "Nav_Products": "Products",
    "Nav_AboutUs": "About Us",
    "Nav_ContactUs": "Contact Us",
    "Nav_Login": "Login",
    "Nav_Profile": "Profile",
    "Nav_SelectCountry": "Select Country",
    "Nav_Cart": "Shopping Cart",

    // 🔑 LANDING / MODAL
    "Welcome": "Where are you visiting from?",
    "SelectCountry": "Select your country to see the correct catalog and language.",
    "ChangeLater": "You can change this preference later in the menu.",
    "ElSalvador": "🇸🇻 El Salvador — Spanish",
    "USA": "🇺🇸 United States — English",

    // 🔑 PRODUCTS PAGE (Ejemplo)
    "Products_PromoTitleLine1": "Enjoy the",
    "Products_PromoTitleLine2": "best",
    "Products_PromoTitleLine3": "promotions",
    "Products_NoProductsAvailable": "No products available for {{region}}",
    "Products_ComeBackSoon": "Check back soon for new arrivals",

    // 🔑 GLOBAL
    "AddToCart": "Add to Cart",
  },
};

// 🔑 Función de utilidad para obtener la traducción
// Usaremos esta función en todos los componentes que necesiten traducción.
export const getTranslation = (key, lang) => {
    return translations[lang] ? translations[lang][key] : translations['es'][key] || key;
};