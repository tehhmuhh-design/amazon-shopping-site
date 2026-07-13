import React from "react";
import { Link } from "react-router-dom"; // 1. Import Link
import classes from "./Header.module.css"; // Ensure this matches your CSS file

function LowerHeader() {
  return (
    <div className={classes.lower__container}>
      <ul>
        <li>All</li>
        <li>Today's Deals</li>
        <li>Customer Services</li>
        <li>Registry</li>
        <li>Gift Cards</li>
        
        {/* 2. Wrap "Sell" in a Link pointing to /add-product */}
        <li>
          <Link to="/add-product" style={{ color: "white", textDecoration: "none" }}>
            Sell
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default LowerHeader;