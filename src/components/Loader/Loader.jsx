import React from "react";
import { ClipLoader } from "react-spinners";

// Centered loading spinner shown while data is being fetched.
const wrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: "40vh",
};

function Loader() {
  return (
    <div style={wrapperStyle}>
      <ClipLoader color="#febd69" size={50} speedMultiplier={0.9} />
    </div>
  );
}

export default Loader;
