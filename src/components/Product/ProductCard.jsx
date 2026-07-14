import React, { useContext } from "react"; // Importing React and the useContext hook
import Rating from "@mui/material/Rating"; // Importing the Rating component from Material UI
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat"; // Importing a custom currency formatting component
import classes from "./Product.module.css"; // Importing CSS module for product-specific styles
import { Link } from "react-router-dom"; // Importing Link from react-router-dom for navigation
import { DataContext } from "../DataProvider/DataProvider"; // Importing the global state context
import { Type } from "../../Utility/action.type"; // Importing action types for dispatching actions to the reducer

// Functional component for rendering a single product card
function ProductCard({
  product, // Object containing product details
  flex, // Optional flag for rendering layout as flex
  add_description, // Flag to optionally render the full description
  renderAdd, // Flag to render the "Add to Cart" button
  sliceDesc, // Flag to slice the description and title
  titleUp, // Flag to show title on top
}) {
  // Destructuring product details
  const { image, title, id, rating, price, description, sellerId } = product;

  // Accessing global state and dispatch function from DataContext
  const [{ user }, dispatch] = useContext(DataContext);

  // A product is "yours" only if it has a sellerId (user-uploaded, not a demo
  // product) AND that sellerId matches the logged-in user. Demo/FakeStore
  // products have no sellerId, so they remain purchasable by everyone.
  const isOwnListing = Boolean(sellerId) && user?.uid === sellerId;

  // Function to add the product to the cart
  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET, // Dispatching an action to add the item to the basket
      item: {
        image,
        title,
        id,
        rating,
        price,
        description,
        sellerId, // carry the seller through so the basket/checkout knows the owner
      },
    });
  };

  return (
    <div
      className={`${classes.productCard__container} ${
        flex ? classes.product_detail : "" // Conditionally adding a class for layout adjustment
      }`}
    >
      {/* Link to the product details page */}
      <Link to={`/products/${id}`}>
        <img
          src={image} // Product image
          alt={title} // Alt text for accessibility
          className={classes.productCard__img__container} // Styling for the image
        />
      </Link>

      <div>
        {/* Conditionally render title on top or as sliced */}
        {titleUp && <h3>{title}</h3>}
        {sliceDesc && <h3>{`${title.slice(0, 30)} ...`}</h3>}{" "}
        {/* Slice the title if sliceDesc is true */}
        {/* Conditionally render full or sliced description */}
        {add_description && (
          <div style={{ maxWidth: "750px" }}>{description}</div> // Full description if add_description is true
        )}
        {sliceDesc && (
          <div style={{ maxWidth: "350px" }}>{`${description.slice(
            0,
            90
          )}...`}</div> // Sliced description
        )}
        {/* Display the product's rating */}
        <div className={classes.productCard__rating}>
          <Rating value={rating?.rate} precision={0.1} />{" "}
          {/* Rating with a precision of 0.1 */}
          <small>{rating?.count}</small> {/* Number of ratings */}
        </div>
        {/* Display the product's price formatted as currency */}
        <div>
          <CurrencyFormat amount={price} />{" "}
          {/* Custom currency formatting component */}
        </div>
        {/* Conditionally render "Add to Cart" button.
            If this is the user's own listing, show a disabled notice instead so
            they can't buy their own product. */}
        {renderAdd &&
          (isOwnListing ? (
            <button
              className={classes.productCard__button}
              disabled
              style={{
                background: "#e7e9ec",
                color: "#565959",
                cursor: "not-allowed",
              }}
            >
              This is your listing
            </button>
          ) : (
            <button className={classes.productCard__button} onClick={addToCart}>
              Add to cart
            </button>
          ))}
      </div>
    </div>
  );
}

export default ProductCard; // Exporting the component for use in other parts of the application