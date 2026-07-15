import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // to read the "order placed" message
import LayOut from "../../components/LayOut/LayOut"; // Layout component
import { db } from "../../Utility/firebase"; // Firebase database instance
import { DataContext } from "../../components/DataProvider/DataProvider"; // Global state context
import classes from "./Orders.module.css"; // Orders-specific styling
import ProductCard from "../../components/Product/ProductCard"; // Individual product display
import OrderTracker from "./OrderTracker"; // Amazon-style delivery tracker

// Functional component to display user orders
function Orders() {
  const [{ user }] = useContext(DataContext); // Current user from global state
  const [orders, setOrders] = useState([]); // The user's orders
  const navState = useLocation(); // carries { msg: "You have placed a new order" }

  // Show the "order placed" confirmation banner briefly after checkout.
  const [showConfirm, setShowConfirm] = useState(Boolean(navState?.state?.msg));

  useEffect(() => {
    if (navState?.state?.msg) {
      const t = setTimeout(() => setShowConfirm(false), 6000); // hide after 6s
      return () => clearTimeout(t);
    }
  }, [navState]);

  // Fetch orders from Firebase whenever the user changes
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <LayOut>
      <section className={classes.orders}>
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>

          {/* Confirmation banner shown right after placing an order */}
          {showConfirm && (
            <div className={classes.orders__confirm}>
              ✅ {navState.state.msg}. Your order is on its way!
            </div>
          )}

          {/* If there are no orders, display a message */}
          {orders?.length === 0 && (
            <div className={classes.orders__empty}>
              <p>You don't have orders yet.</p>
            </div>
          )}

          {/* Display each order */}
          <div>
            {orders?.map((eachOrder, i) => (
              <div key={i} className={classes.orders__order}>
                <hr />
                <p className={classes.orders__id}>Order ID: {eachOrder?.id}</p>

                {/* Amazon-style delivery tracker for this order */}
                <OrderTracker created={eachOrder?.data?.created} />

                {/* Products in this order */}
                {eachOrder?.data?.basket?.map((order) => (
                  <ProductCard
                    key={order.id}
                    product={order}
                    flex={true}
                    titleUp={true}
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

export default Orders;