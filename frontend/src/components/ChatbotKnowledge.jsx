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
    answer: "Somos una joyería **exclusivamente online** (eCommerce) para reducir costos y ofrecerte mejores precios, o puedes encontrarnos en Santa Ana, Ciudad Real.",
  },
  {
    query: /tel(é|e)fono|llamar|contactar/i,
    answer: "Puedes contactarnos por email a **eternaljoyeria1@gmail.com** o por WhatsApp al +503 6316-8938.",
  },

  // --- SOBRE ETERNAL JOYERÍA ---
  {
    query: /qué es eternal joyer(í|i)a|quienes son/i,
    answer: "Eternal Joyería es una marca que crea piezas únicas bañadas en resina, diseñadas para capturar la luz, la energía y los momentos que deseas conservar para siempre. Cada joya está hecha con dedicación y un toque de eternidad.",
  },
  {
    query: /quiénes están detrás de eternal joyer(í|i)a|equipo/i,
    answer: "Somos un equipo apasionado por el arte, el diseño y la belleza de los detalles. Creemos que cada joya puede contar una historia, y trabajamos para que la tuya brille con autenticidad.",
  },
  {
    query: /significado del nombre|qué significa eternal/i,
    answer: "“Eternal” representa lo que nunca se apaga: la belleza, la emoción y los recuerdos que perduran. Nuestras joyas buscan reflejar eso mismo: un instante eterno en una pieza.",
  },
  {
    query: /qué hace diferente a eternal joyer(í|i)a|diferencia con otras marcas/i,
    answer: "Cada joya de Eternal está hecha a mano y bañada en resina con técnicas artesanales. No producimos en masa; cada pieza tiene su propio carácter, brillo y alma.",
  },
  {
    query: /materiales|de qué están hechas las joyas/i,
    answer: "Trabajamos con resina de alta calidad, metales bañados en oro o plata y pequeños detalles naturales o pigmentos únicos que dan vida a cada diseño.",
  },
  {
    query: /resina|por qué usan resina/i,
    answer: "La resina nos permite encapsular color, brillo y textura de una forma mágica. Es resistente, versátil y da un acabado cristalino que realza la belleza de cada pieza.",
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

  // --- CUIDADO DE JOYAS ---
  {
    query: /cuidado|cómo limpiar|mantener joyas/i,
    answer: "Para mantener tus joyas como nuevas, evita exponerlas a químicos fuertes, perfumes o agua. Límpialas suavemente con un paño seco y guárdalas en un lugar protegido de la luz directa.",
  },
  {
    query: /resina se raya|daños en resina/i,
    answer: "La resina es resistente pero puede rayarse con objetos filosos. Manipula con cuidado y guarda las joyas por separado para evitar fricciones.",
  },

  // --- FORMAS DE PAGO ---
  {
    query: /formas de pago|cómo pagar|tarjetas/i,
    answer: "Aceptamos pagos con **tarjeta de crédito, débito, PayPal y transferencias bancarias**. Todos los pagos son seguros y encriptados.",
  },
  {
    query: /cuotas|pago a plazos/i,
    answer: "Algunas tarjetas permiten pagos en cuotas. Consulta con tu banco las opciones disponibles.",
  },

  // --- RECOMENDACIONES DE USO ---
  {
    query: /regalos|ocasiones especiales|cumpleaños|aniversario/i,
    answer: "Nuestras joyas son ideales para **regalos en cumpleaños, aniversarios o momentos especiales**. Cada pieza viene cuidadosamente empaquetada para sorprender a quien la recibe.",
  },
  {
    query: /combinar|outfit|moda/i,
    answer: "Para un look armonioso, combina nuestras piezas con ropa en tonos neutros o con accesorios minimalistas. La resina y los metales bañados destacan sobre cualquier outfit.",
  },
];
