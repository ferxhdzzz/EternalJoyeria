import React from 'react'; // Imports the React library, essential for creating React components.
import './MyStory.css'; // Imports the specific stylesheet for this component.

// Defines the MyStory functional component.
const MyStory = () => {
  // Defines an array of strings representing a color palette, extracted from the design image.
  const colorPalette = ['#a87c8b', '#6c4e59', '#d9c4c4', '#8b6b78'];

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // The main section element for the 'My Story' content.
    <section className="my-story">
      {/* A wrapper for the image and the color palette to group them visually. */}
      <div className="my-story__image-wrapper">
        {/* Container specifically for the image to help with styling and positioning. */}
        <div className="my-story__image-container">
          {/* The image of the creator. */}
          <img 
            src="/aboutUsimage.png" // The source path for the image.
            alt="Creadora de Eternal Joyería" // Alt text for accessibility and SEO.
            className="my-story__image" // Applies styling to the image.
          />
        </div>
        {/* Container for the color palette display. */}
        <div className="my-story__palette">
          {/* Maps over the colorPalette array to create a div for each color. */}
          {colorPalette.map((color, index) => (
            // A div representing a single color swatch.
            <div 
              key={index} // A unique key for each element in the list, important for React's rendering.
              className="my-story__palette-color" // Applies styling to the color swatch.
              style={{ backgroundColor: color }} // Sets the background color of the div dynamically.
            ></div>
          ))}
        </div>
      </div>

      {/* Container for the textual content of the story. */}
      <div className="my-story__text-content">
        {/* The title of the section. */}
        <h2 className="my-story__title">Mi historia</h2>
        {/* The main paragraph of text telling the story. */}
        <p className="my-story__text">
          Soy creadora de joyería y accesorios de acero, piedras naturales y flores exóticas, cultivadas y preservadas para la eternidad. He tratado de conservar la forma y el color original de cada flor, en especial las orquídeas, creando así una joya y accesorio único, original e irrepetible, que durará para siempre.
        </p>
      </div>
    </section>
  );
};

// Exports the MyStory component to be used in other parts of the application.
export default MyStory;
