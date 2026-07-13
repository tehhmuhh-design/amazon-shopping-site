import React from "react";
import LayOut from "../../components/LayOut/LayOut"; // Importing the layout component for consistent header/footer
import CarouselsEffect from "../../components/Carousel/Carousel"; // Importing the carousel component for a slideshow effect
import Category from "../../components/Category/Category"; // Importing the category component to display product categories
import Product from "../../components/Product/Product"; // Importing the product component to display a list of products
import classes from "./Landing.module.css";
// Functional component representing the landing page of the application
function Landing() {
  return (
    <LayOut>
      <div className={classes.Landing__container}>
        {/* Carousel section displaying a slideshow */}
        <CarouselsEffect />

        {/* Category section displaying product categories */}
        <Category />

        {/* Product section displaying a list of products */}
        <Product />
      </div>
    </LayOut>
  );
}

export default Landing; // Exporting the component for use in other parts of the application
