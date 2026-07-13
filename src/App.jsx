import { useContext, useEffect } from "react"; // Importing React hooks
import "./App.css"; // Importing the CSS for the app
import Routing from "./Router.jsx"; // Importing the routing component that handles different routes in the app
import { DataContext } from "./components/DataProvider/DataProvider.jsx"; // Importing the global state context provider
import { auth } from "./Utility/firebase.js"; // Importing Firebase authentication instance
import { Type } from "./Utility/action.type.js"; // Importing action types for the reducer

// The main App component
function App() {
  const [dispatch] = useContext(DataContext); // Accessing the user and dispatch from global state

  // useEffect to handle Firebase authentication state
  useEffect(() => {
    // Firebase listener for auth state changes (user login/logout)
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // If a user is logged in, dispatch an action to set the user in the global state
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      } else {
        // If no user is logged in, set the user to null in the global state
        dispatch({
          type: Type.SET_USER,
          user: null,
        });
      }
    });
  }, [dispatch]); // The effect depends on dispatch and runs only once (on mount)

  // Render the routing component which manages page routing
  return <Routing />;
}

export default App; // Exporting the App component
