import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/amazon-logo-white.png"; // Amazon logo image
import { BsSearch } from "react-icons/bs"; // Search icon from react-icons
import { SlLocationPin } from "react-icons/sl"; // Location pin icon
import { BiCart } from "react-icons/bi"; // Cart icon
import classes from "./Header.module.css"; // Importing styles specific to the Header component
import LowerHeader from "./LowerHeader"; // Importing another component for the lower part of the header
import { DataContext } from "../DataProvider/DataProvider"; // Importing the data context to access the basket and user
import { auth } from "../../Utility/firebase"; // Firebase authentication for signing in/out
import { Type } from "../../Utility/action.type"; // Reducer action types
import axios from "axios"; // Axios for making HTTP requests
import { productUrl } from "../../Api/endPoints"; // API endpoint for products

function Header() {
  // Accessing the basket (cart items) and user from the context
  const [{ basket, user }, dispatch] = useContext(DataContext);

  // Calculate total items in the basket (cart) using reduce
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);

  // States for categories, selected category, search term, and suggestions
  const [categories, setCategories] = useState([]); // Stores categories for dropdown
  const [selectedCategory, setSelectedCategory] = useState(""); // Stores the selected category from the dropdown
  const [searchTerm, setSearchTerm] = useState(""); // Stores the user's search input
  const [suggestions, setSuggestions] = useState([]); // Stores search suggestions based on the search term

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch categories from FakeStore API when the component mounts
  useEffect(() => {
    axios
      .get(`${productUrl}/products/categories`) // GET request to fetch categories
      .then((response) => {
        setCategories(response.data); // Setting the categories in the state
      })
      .catch((error) => {
        console.error("Error fetching categories:", error); // Log any errors
      });
  }, []);

  // Sign the user out of Firebase AND clear the app's user state, then go home.
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch({ type: Type.SET_USER, user: null });
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  // Handle changes in the search input field
  const handleSearchInputChange = (e) => {
    const value = e.target.value; // Get the current value of the input
    setSearchTerm(value); // Set the search term state

    // If search input is not empty, fetch matching products
    if (value.length > 0) {
      axios
        .get(`${productUrl}/products`) // GET request to fetch all products
        .then((response) => {
          // Filter products to match the search term
          const filteredProducts = response.data.filter((product) =>
            product.title.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filteredProducts); // Set the filtered products as suggestions
        })
        .catch((error) => {
          console.error("Error fetching products:", error); // Log any errors
        });
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  // Handle when a suggestion is clicked
  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`); // Navigate to the product details page
    setSearchTerm(""); // Clear the search term
    setSuggestions([]); // Clear suggestions
  };

  // Handle the search action when the search icon is clicked
  const handleSearch = () => {
    const category = selectedCategory || "all"; // Use selected category or 'all' if none selected
    navigate(
      `/results?category=${encodeURIComponent(
        category
      )}&search=${encodeURIComponent(searchTerm)}` // Navigate to the search results page with category and search term as query parameters
    );
  };

  return (
    <section className={classes.header__outerContainer}>
      <header>
        <section className={classes.header__container}>
          {/* Logo */}
          <div className={classes.logo__container}>
            <Link to="/">
              <img src={logo} alt="amazon logo" />{" "}
              {/* Amazon logo with link to homepage */}
            </Link>

            {/* Delivery location */}
            <div className={classes.delivery}>
              <span>
                <SlLocationPin size={19} /> {/* Location pin icon */}
              </span>
              <div>
                <p>Deliver to</p>
                <span>Ethiopia</span> {/* Static delivery location */}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className={classes.header__search}>
            {/* Category Dropdown */}
            <select
              className={classes.header__search_category}
              value={selectedCategory} // Current selected category
              onChange={(e) => setSelectedCategory(e.target.value)} // Handle category change
            >
              <option value="">All</option> {/* Default 'All' option */}
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                  {/* Capitalize category names */}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className={classes.header__search_InputContainer}>
              <input
                type="text"
                placeholder="Search Amazon"
                value={searchTerm} // Current search term
                onChange={handleSearchInputChange} // Handle search input change
              />
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <ul className={classes.header__search_suggestionsList}>
                  {suggestions.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                    >
                      {product.title}{" "}
                      {/* Display product title in suggestions */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Search Icon */}
            <BsSearch
              className={classes.header__search_icon}
              size={40}
              onClick={handleSearch} // Trigger search on icon click
            />
          </div>

          {/* Right-side Links (Account, Orders, Cart) */}
          <div className={classes.order__container}>
            {/* Language Selector */}
            <a href="" className={classes.language}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg"
                alt="USA Flag"
              />
              <select>
                <option>EN</option> {/* Static language option */}
              </select>
            </a>

            {/* Sign In / Sign Out */}
            <Link to={user ? "/orders" : "/auth"}>
              <div>
                {user ? ( // If the user is signed in
                  <>
                    <p>Hello, {user?.email?.split("@")[0]}</p>{" "}
                    {/* Greet the user */}
                    <span
                      onClick={(e) => {
                        e.preventDefault(); // don't let the Link navigate
                        handleSignOut();
                      }}
                    >
                      Sign out
                    </span>{" "}
                    {/* Sign out option */}
                  </>
                ) : (
                  <>
                    <p>Hello, Sign In</p> {/* If no user, show Sign In */}
                    <span>Account & Lists</span>
                  </>
                )}
              </div>
            </Link>

            {/* Sell on Amazon (upload a product) */}
            <Link to="/add-product">
              <p>Sell on</p>
              <span>Amazon</span>
            </Link>

            {/* Orders */}
            <Link to="/orders">
              <p>returns</p>
              <span>& Orders</span> {/* Link to user's orders */}
            </Link>

            {/* Cart */}
            <Link to="/cart" className={classes.cart}>
              <BiCart size={35} /> {/* Cart icon */}
              <span>{totalItem}</span> {/* Display total items in cart */}
            </Link>
          </div>
        </section>
      </header>
      <LowerHeader /> {/* Rendering the LowerHeader component */}
    </section>
  );
}

export default Header;