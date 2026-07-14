import { useContext, useEffect } from "react"; // Importing React hooks
import "./App.css"; // Importing the CSS for the app
import Routing from "./Router.jsx"; // Importing the routing component that handles different routes in the app
import { DataContext } from "./components/DataProvider/DataProvider.jsx"; // Importing the global state context provider
import { auth } from "./Utility/firebase.js"; // Importing Firebase authentication instance
import { Type } from "./Utility/action.type.js"; // Importing action types for the reducer

// The main App component
function App() {
  // The context value is [state, dispatch]. We only need dispatch here, so we
  // skip the first slot. (The previous `const [dispatch]` grabbed STATE by
  // mistake and named it dispatch, which broke the listener.)
  const [, dispatch] = useContext(DataContext);

  // useEffect to handle Firebase authentication state
  useEffect(() => {
    // Firebase listener for auth state changes (user login/logout). It fires
    // once on mount with the current session (or null), then on every
    // login/logout. Returns an unsubscribe function for cleanup.
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      // Mirror Firebase's session into global state.
      dispatch({
        type: Type.SET_USER,
        user: authUser || null,
      });

      // Tell protected routes the auth check is complete so they stop waiting.
      dispatch({
        type: Type.SET_AUTH_LOADING,
        authLoading: false,
      });
    });

    // Clean up the listener when App unmounts.
    return () => unsubscribe();
  }, [dispatch]); // Runs once on mount

  // Render the routing component which manages page routing
  return <Routing />;
}

export default App; // Exporting the App component