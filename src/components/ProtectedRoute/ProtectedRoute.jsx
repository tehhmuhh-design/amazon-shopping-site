import React, { useContext, useEffect } from "react"; // Importing React hooks
import { useNavigate } from "react-router-dom"; // Importing the useNavigate hook for navigation
import { DataContext } from "../DataProvider/DataProvider"; // Importing the global state context

// Functional component to protect routes that require authentication
function ProtectedRoute({ children, msg, redirect }) {
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate to different routes
  const [{ user }] = useContext(DataContext); // Accessing the global state to get the 'user' object from DataContext

  // useEffect hook to check if the user is authenticated when the component renders
  useEffect(() => {
    if (!user) {
      // If user is not logged in, redirect to the /auth page with a message and redirect path
      navigate("/auth", { state: { msg, redirect } });
    }
  }, [user, navigate, msg, redirect]); // Dependencies for useEffect: triggers if user or navigate or msg changes

  return children; // If the user is authenticated, render the child components
}

export default ProtectedRoute; // Exporting the component for use in other parts of the application
