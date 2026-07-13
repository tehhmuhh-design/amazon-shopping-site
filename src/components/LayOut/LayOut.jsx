import React from "react"; // Importing React
import Header from "../Header/Header"; // Importing the Header component

// Functional component LayOut that serves as a layout wrapper
function LayOut({ children }) {
  return (
    <div>
      {/* Render the Header component at the top of the layout */}
      <Header />

      {/* Render any child components passed to the LayOut component */}
      {children}
    </div>
  );
}

export default LayOut; // Exporting the LayOut component for use in other parts of the application
