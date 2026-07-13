import React, { useContext, useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut"; // Importing the layout component
import { db } from "../../Utility/firebase"; // Importing Firebase database instance
import { DataContext } from "../../components/DataProvider/DataProvider"; // Importing the global state context
import classes from "./Orders.module.css"; // Importing CSS module for orders-specific styling
import ProductCard from "../../components/Product/ProductCard"; // Importing the ProductCard component to display individual products in an order

// Functional component to display user orders
function Orders() {
  const [{ user }] = useContext(DataContext); // Accessing the current user from global state
  const [orders, setOrders] = useState([]); // State to hold the user's orders

  // Fetch orders from Firebase whenever the user changes
  useEffect(() => {
    if (user) {
      // Access the 'orders' collection in Firebase for the current user, sorted by creation time (desc)
      db.collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          // console.log(snapshot);
          // Map through the snapshot and update the orders state with the fetched data
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    } else {
      setOrders([]); // If there's no user, clear the orders
    }
  }, [user]); // Dependency array makes sure this runs whenever the user changes

  return (
    <LayOut>
      <section className={classes.orders}>
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>
          {/* If there are no orders, display a message */}
          {orders?.length === 0 && (
            <div className={classes.orders__empty}>
              <p>You don't have orders yet.</p>
            </div>
          )}

          {/* Display each order */}
          <div>
            {orders?.map((eachOrder, i) => (
              <div key={i}>
                <hr />
                <p>Order ID: {eachOrder?.id}</p> {/* Display the order ID */}
                {/* For each order, map through the products in the basket and display each using ProductCard */}
                {eachOrder?.data?.basket?.map((order) => (
                  <ProductCard
                    key={order.id}
                    product={order} // Pass the product data to ProductCard
                    flex={true} // Apply flexible layout
                    titleUp={true} // Show the title at the top of the card
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders; // Exporting the component for use in other parts of the application
