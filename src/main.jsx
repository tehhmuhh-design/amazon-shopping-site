import { StrictMode } from "react"; // Importing StrictMode for highlighting potential issues in the app
import { createRoot } from "react-dom/client"; // Importing createRoot for rendering the React application
import App from "./App.jsx"; // Importing the main App component
import "./index.css"; // Importing global styles for the app
import { DataProvider } from "./components/DataProvider/DataProvider.jsx"; // Importing the global state provider
import { initialState, reducer } from "./Utility/reducer.js"; // Importing the initial state and reducer for state management

// Creating the root element in the DOM and rendering the app inside it
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrapping the App component with the DataProvider to provide global state to the entire app */}
    <DataProvider reducer={reducer} initialState={initialState}>
      <App />
    </DataProvider>
  </StrictMode>
);
