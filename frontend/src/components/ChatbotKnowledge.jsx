// 🚨 Nombre del Asistente
export const CHATBOT_NAME = "Eternia";

// 🚨 BASE DE CONOCIMIENTO GENERAL (GLOBAL)
export const GLOBAL_KNOWLEDGE = [
  // --- INFORMACIÓN GENERAL DE LA EMPRESA ---
  {
    query: /horario|horarios de atenci(ó|o)n|cuando abren/i,
    answer: "Nuestro horario de atención al cliente (soporte) es de Lunes a Viernes, de 9:00 AM a 6:00 PM (hora de El Salvador). La tienda online está abierta 24/7.",
  },
  {
    query: /ubicaci(ó|o)n|tienda f(í|i)sica|donde est(á|a)n/i,
    answer: "Somos una joyeria **exclusivamente online** (eCommerce) para reducir costos y ofrecerte mejores precios, o puedes encontrarnos en Santa Ana, Ciudad Real",
  },
  {
    query: /tel(é|e)fono|llamar|contactar/i,
    answer: "Puedes contactarnos por email a **eternaljoyeria1@gmail.com** o por WhatsApp al +503 6316-8938.",
  },
  
  // --- PRODUCTOS Y CATEGORÍAS ---
  {
    query: /categor(í|i)as|tipos de joya|que venden/i,
    answer: "Nuestras categorías principales son: **Anillos**, **Collares**, **Aretes** y **Pulseras**!",
  },
  {
    query: /mejores ofertas|descuentos|promociones/i,
    answer: "¡Siempre tenemos ofertas! Te recomiendo visitar nuestra sección de **Ofertas Especiales** o suscribirte a nuestro newsletter para recibir un 10% de descuento en tu primera compra.",
  },

  // --- PROCESO Y TENDENCIAS ---
  {
    query: /proceso de creaci(ó|o)n|c(ó|o)mo se hacen las joyas/i,
    answer: "El proceso es totalmente **artesanal**. Incluye diseño 3D, fundición con metales preciosos certificados, tallado a mano y un pulido final de alta calidad.",
  },
  {
    query: /cu(á|a)nto tarda|tiempo de creaci(ó|o)n/i,
    answer: "Dado que muchas de nuestras piezas se hacen bajo pedido, el proceso de creación suele tardar entre **7 y 10 días hábiles** antes de ser enviadas.",
  },
  {
    query: /tendencias|que est(á|a) de moda/i,
    answer: "Las tendencias actuales se centran en el oro rosa, las joyas minimalistas con diamantes de laboratorio y los diseños inspirados en la naturaleza. ¡Explora nuestra colección 'Minimal'!",
  },
  
  // --- POLÍTICAS ---
  {
    query: /pol(í|i)tica de devoluci(ó|o)n|garant(í|i)a|c(ó|o)mo devuelvo/i,
    answer: "Ofrecemos una garantía de 1 año contra defectos de fabricación. Las devoluciones son aceptadas en un plazo de 30 días si la joya no ha sido usada.",
  },
  {
    query: /env(í|i)o|costo de entrega|env(í|i)o gratis/i,
    answer: "El envío es **gratis** a cualquier parte del país.",
  },
];
