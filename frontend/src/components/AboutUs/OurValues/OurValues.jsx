import React from 'react'; // Imports the React library, which is necessary for creating React components.
import './OurValues.css'; // Imports the specific stylesheet for styling the OurValues component.

// Defines the OurValues functional component, which displays the core values of the company.
const OurValues = () => {
  // An array of objects that holds the data for each company value.
  // This approach makes the component easily scalable; new values can be added here without changing the JSX.
  const values = [
    {
      title: 'Exclusividad', // The title of the value.
      description: 'Nuestras colecciones están pensadas para quienes buscan piezas únicas que reflejen su identidad.', // A brief description of the value.
      className: 'exclusividad' // A unique class name for applying specific styles to this card (e.g., background image).
    },
    {
      title: 'Artesanía', // The title of the value.
      description: 'Cada pieza es creada con atención al detalle, combinando técnicas tradicionales con diseños modernos.', // A brief description of the value.
      className: 'artesania' // A unique class name for applying specific styles to this card.
    },
    {
      title: 'Calidad', // The title of the value.
      description: 'Solo trabajamos con materiales nobles y duraderos que garantizan belleza a lo largo del tiempo.', // A brief description of the value.
      className: 'calidad' // A unique class name for applying specific styles to this card.
    }
  ];

  // The return statement renders the component's JSX structure.
  return (
    // A semantic <section> element groups the content for the 'Our Values' section.
    <section className="our-values">
      {/* The main heading for the section. */}
      <h2 className="our-values__title">Nuestros valores</h2>
      {/* This container will hold the grid of value cards. */}
      <div className="our-values__cards-container">
        {/* The .map() method iterates over the 'values' array to dynamically generate a card for each item. */}
        {values.map((value, index) => (
          // Each card is a div. The 'key' prop is crucial for React to efficiently update and manage the list of elements.
          // The className is dynamic, combining a base class with a specific class from the data object.
          <div key={index} className={`our-values__card ${value.className}`}>
            {/* The title of the value is rendered in an h3 element. */}
            <h3 className="our-values__card-title">{value.title}</h3>
            {/* The description of the value is rendered in a p element. */}
            <p className="our-values__card-description">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Exports the OurValues component, making it available for import in other files.
export default OurValues;
