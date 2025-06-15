import React from 'react'; // Imports the React library, which is necessary to define React components.
import './HeroAboutUs.css'; // Imports the specific stylesheet for styling the HeroAboutUs component.

// Defines the HeroAboutUs functional component. It accepts 'imageSrc' and 'imageAlt' as props.
const HeroAboutUs = ({ imageSrc, imageAlt = 'Imagen de fondo' }) => {
  // Dynamically constructs the className string for the section. It adds 'has-image' if an image source is provided.
  const sectionClasses = `hero-about-us ${imageSrc ? 'has-image' : ''}`;

  // The return statement renders the component's JSX.
  return (
    // A React Fragment is used to group elements without adding an extra node to the DOM.
    <>
      {/* This inline SVG is used to define a clipping path. It is not rendered directly. */}
      <svg height="0" width="0" style={{ position: 'absolute' }}>
        {/* The <defs> element stores graphical objects for later use. */}
        <defs>
          {/* Defines a clipping path with a unique ID that can be applied via CSS. */}
          <clipPath id="hero-down-curve" clipPathUnits="objectBoundingBox">
            {/* The path data defines the shape of the clip path: a rectangle with a curved bottom edge. */}
            <path d="M0,0 L1,0 L1,0.8 C0.75,1, 0.25,1, 0,0.8 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* The main hero section element. Its classes are set dynamically. */}
      <section className={sectionClasses}>
        {/* This is a conditional render. The image container will only be in the DOM if 'imageSrc' is truthy. */}
        {imageSrc && (
          // A container for the background image, used for styling and positioning.
          <div className="hero-about-us__image-container">
            {/* The actual image element. */}
            <img 
              src={imageSrc} // The image URL is passed in as a prop.
              alt={imageAlt} // The alt text is passed in as a prop for accessibility.
              className="hero-about-us__image" // Applies styles to the image.
            />
          </div>
        )}

        {/* A container for the textual content of the hero section. */}
        <div className="hero-about-us__content">
          {/* The main heading of the hero section. */}
          <h1 className="hero-about-us__title">
            Joyas con alma <br /> natural {/* A line break is used for stylistic control over the title's layout. */}
          </h1>
          {/* The subtitle or descriptive paragraph. */}
          <p className="hero-about-us__subtitle">
            Celebra cada momento con una pieza eterna, hecha con flores reales encapsuladas con amor.
          </p>
        </div>
      </section>
    </>
  );
};

// Exports the HeroAboutUs component, making it available for import in other files.
export default HeroAboutUs;

