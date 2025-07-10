import React from 'react'; // Imports the React library, which is essential for defining React components.
import './MissionAndVision.css'; // Imports the specific stylesheet for styling this component.

// Defines the MissionAndVision functional component, which displays the company's mission and vision.
const MissionAndVision = () => {
  // The return statement renders the component's structure using JSX.
  return (
    // A semantic <section> element is used to group the related content of mission and vision.
    <section className="mission-vision">
      {/* This container holds all the textual content, separating it from the image. */}
      <div className="mission-vision__content">
        {/* The main heading for the section. */}
        <h2 className="mission-vision__title">Nuestra visión y misión</h2>
        {/* This container holds the mission and vision blocks and the decorative SVG path that connects them. */}
        <div className="mission-vision__path-container">
          {/* This SVG creates a decorative, dashed, S-shaped line that visually connects the mission and vision blocks. */}
          <svg className="mission-vision__path-svg" width="200" height="350" viewBox="0 0 200 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* The <path> element defines the curve's geometry, stroke color, width, and dash pattern. */}
            <path d="M100 0 C-20 80, 220 120, 80 220 C-40 320, 180 350, 100 400" stroke="#848484" strokeWidth="1.5" strokeDasharray="4 4"/>
          </svg>
          {/* This block contains the content for the company's mission. */}
          <div className="mission-vision__text-block mission-vision__mission">
            {/* A subheading for the Mission statement. */}
            <h3>Misión</h3>
            {/* The paragraph containing the mission statement. */}
            <p>Crear joyas únicas que realcen la belleza y celebren momentos inolvidables.</p>
          </div>
          {/* This block contains the content for the company's vision. */}
          <div className="mission-vision__text-block mission-vision__vision">
            {/* A subheading for the Vision statement. */}
            <h3>Visión</h3>
            {/* The paragraph containing the vision statement. */}
            <p>Ser la marca que transforma emociones en joyas eternas.</p>
          </div>
        </div>
      </div>
      {/* This container holds the decorative image for the section. */}
      <div className="mission-vision__image-container">
        {/* The <img> element itself, with a descriptive alt text for accessibility. */}
        <img src="/AboutUs/MisionAndVisionImage.png" alt="Modelo con joyas de EternalJoyeria" />
      </div>
    </section>
  );
};

// Exports the MissionAndVision component, making it available for use in other parts of the application.
export default MissionAndVision;
