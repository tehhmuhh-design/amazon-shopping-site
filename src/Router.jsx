import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importing React Router components for routing
import Landing from "./Pages/Landing/Landing"; // Importing the Landing (home) page component
import SignIn from "./Pages/Auth/Auth"; // Importing the SignIn page component
import Payment from "./Pages/Payment/Payment"; // Importing the Payment page component
import Orders from "./Pages/Orders/Orders"; // Importing the Orders page component
import Cart from "./Pages/Cart/Cart"; // Importing the Cart page component
import Results from "./Pages/Results/Results"; // Importing the Results page component for search results
import ProductDetail from "./Pages/ProductDetail/ProductDetail"; // Importing the ProductDetail page component
import AddProduct from "./Pages/AddProduct/AddProduct"; // Importing the page used to upload/sell a product
import { Elements } from "@stripe/react-stripe-js"; // Importing Stripe Elements to handle payment forms
import { loadStripe } from "@stripe/stripe-js"; // Importing Stripe's loadStripe function to initialize Stripe
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; // Importing the ProtectedRoute component to secure routes

// Initializing Stripe with the public key for handling payments
const stripePromise = loadStripe(
  "pk_test_51Q21RTKXqjMvF8GpDxoYiJrJakY0EfRCfYMvM8Cv5Fm3M1Uj7iPBTAYSDO8gFJZfNptmVcTLePW0Zo569vJv2vwC004KAlge8i"
);

// Functional component to handle routing in the application
function Routing() {
  return (
    <Router>
      <Routes>
        {/* Public route for the landing page */}
        <Route path="/" element={<Landing />} />

        {/* Public route for authentication (Sign In) */}
        <Route path="/auth" element={<SignIn />} />

        {/* Protected route for selling/uploading a product, users must be logged in */}
        <Route
          path="/add-product"
          element={
            <ProtectedRoute
              msg={"You must log in to sell an item"} // Message to show if the user is not logged in
              redirect={"/add-product"} // Redirect back here after login
            >
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* Protected route for payments, users must be logged in */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute
              msg={"You must log in to pay"} // Message to show if the user is not logged in
              redirect={"/payments"} // Redirect back to the payments page after login
            >
              {/* Wrapping Payment component with Stripe Elements */}
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />

        {/* Protected route for viewing orders, users must be logged in */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg={"You must log in to see your orders"} // Message if user is not logged in
              redirect={"/orders"} // Redirect back to the orders page after login
            >
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Route for showing product results based on category */}
        <Route path="/category/:categoryName" element={<Results />} />

        {/* Route for search results */}
        <Route path="/results" element={<Results />} />

        {/* Route for product details page */}
        <Route path="/products/:productId" element={<ProductDetail />} />

        {/* Route for the cart page */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default Routing; // Exporting the Routing component for use in the app
