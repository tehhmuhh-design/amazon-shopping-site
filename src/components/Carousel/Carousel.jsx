import React from "react";
import { Carousel } from "react-responsive-carousel"; // Importing a carousel component from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importing the default styles for the carousel
// import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"; // Commented out unused icon imports
import classes from "./Carousel.module.css"; // Importing CSS module for styling the carousel
import { imgs } from "./imgs/data"; // Importing an array of image links
import { IoIosArrowBack } from "react-icons/io"; // Importing 'back' arrow icon from react-icons
import { IoIosArrowForward } from "react-icons/io"; // Importing 'forward' arrow icon from react-icons

// Function component that implements a carousel with custom left and right arrows
function CarouselsEffect() {
  return (
    <>
      {/* Carousel Component */}
      <Carousel
        autoPlay={true} // Enables auto-playing of images
        infiniteLoop={true} // Enables continuous looping through images
        showIndicators={false} // Hides the small indicator dots under the carousel
        showThumbs={false} // Hides the thumbnail previews of the images
        showStatus={false} // Hides the status information (like image number)
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && ( // Only render the previous arrow if there is a previous item
            <button
              onClick={onClickHandler} // Click event handler for the previous arrow
              title={label} // Sets the label for accessibility
              className={classes.carousel__prev} // Applies styles from the CSS module
            >
              <IoIosArrowBack size={60} /> {/* Custom left arrow icon */}
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && ( // Only render the next arrow if there is a next item
            <button
              onClick={onClickHandler} // Click event handler for the next arrow
              title={label} // Sets the label for accessibility
              className={classes.carousel__next} // Applies styles from the CSS module
            >
              <IoIosArrowForward size={60} /> {/* Custom right arrow icon */}
            </button>
          )
        }
      >
        {/* Loop through images and render them inside the carousel */}
        {imgs.map((imageItemsLinks, i) => {
          return <img key={i} src={imageItemsLinks} alt={`carousel-${i}`} />; // Renders each image in the carousel
        })}
      </Carousel>

      {/* Placeholder for additional styling/content */}
      <div className={classes.hero__img}></div>
    </>
  );
}

export default CarouselsEffect; // Export the component for use in other parts of the application
