import React, { createContext } from "react"; // Importing React and the createContext function
import { useReducer } from "react"; // Importing the useReducer hook

// Creating a new context called DataContext
export const DataContext = createContext();

// DataProvider component that will wrap the application or part of the app to provide state and dispatch
export const DataProvider = ({ children, reducer, initialState }) => {
  return (
    // Providing the state and dispatch function to any child components via DataContext
    <DataContext.Provider value={useReducer(reducer, initialState)}>
      {children} {/* Rendering any child components inside the provider */}
    </DataContext.Provider>
  );
};
