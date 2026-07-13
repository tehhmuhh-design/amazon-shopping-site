import React, { useEffect, useState } from "react"; // Importing React hooks
import { useLocation } from "react-router-dom"; // Importing useLocation hook to access query parameters from the URL
import axios from "axios"; // Importing axios for API requests
import { productUrl } from "../../Api/endPoints"; // Importing API endpoint for products
import ProductCard from "../../components/Product/ProductCard"; // Importing ProductCard to display individual products
import Loader from "../../components/Loader/Loader"; // Importing Loader component to show while data is being fetched
import LayOut from "../../components/LayOut/LayOut"; // Importing layout component for consistent page structure
import classes from "./Results.module.css"; // Importing CSS module for styling

// Functional component to display search results based on category and search term
function Results() {
  const [results, setResults] = useState([]); // State to store the fetched products
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const location = useLocation(); // Hook to access the current URL's search parameters
  const queryParams = new URLSearchParams(location.search); // Extracting query parameters
  const category = queryParams.get("category") || "all"; // Extracting 'category' from query params, default to 'all'
  const searchTerm = queryParams.get("search") || ""; // Extracting 'search' term from query params, default to an empty string

  // useEffect hook to fetch products whenever the category or search term changes
  useEffect(() => {
    setIsLoading(true); // Set loading to true before the API request starts

    // Function to fetch products from the API
    const fetchProducts = async () => {
      try {
        let url = `${productUrl}/products`; // Base URL for fetching products

        // If a specific category is selected, append it to the URL
        if (category && category !== "all") {
          url += `/category/${encodeURIComponent(category)}`;
        }

        const response = await axios.get(url); // Fetch the products from the API
        let products = response.data; // Store the fetched products

        // Filter products based on the search term if provided
        if (searchTerm) {
          products = products.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setResults(products); // Update the results state with the fetched products
      } catch (error) {
        console.error("Error fetching products:", error); // Log any errors that occur during the request
      } finally {
        setIsLoading(false); // Set loading to false once the API request completes
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, [category, searchTerm]); // The effect runs whenever 'category' or 'searchTerm' changes

  return (
    <LayOut>
      <section>
        <h1 style={{ padding: "30px" }}>Results</h1>
        {/* Displaying the current category and search term */}
        <p style={{ padding: "30px" }}>
          {category !== "all" && `Category: ${category}`}{" "}
          {/* Show category if it's not 'all' */}
          {searchTerm && ` | Search: ${searchTerm}`}{" "}
          {/* Show search term if provided */}
        </p>
        <hr />

        {/* Show loader while fetching data, otherwise display results */}
        {isLoading ? (
          <Loader /> // Display the loader while data is being fetched
        ) : (
          <div className={classes.results__container}>
            {/* Check if there are any results and map through them to render ProductCard components */}
            {results.length > 0 ? (
              results.map((data) => (
                <ProductCard
                  key={data.id}
                  product={data} // Passing the product data to ProductCard
                  renderAdd={true} // Allow the "Add to Cart" button
                  add_button={true}
                  titleUp={true} // Show the title at the top of the product card
                />
              ))
            ) : (
              <p>No products found.</p> // Display message if no products match the search/filter
            )}
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Results; // Exporting the Results component for use in other parts of the application
