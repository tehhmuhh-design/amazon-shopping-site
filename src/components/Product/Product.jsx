import React, { useEffect, useState } from "react"; // React hooks
import axios from "axios"; // For the demo catalog (FakeStore API)
import ProductCard from "./ProductCard"; // Renders a single product
import classes from "./Product.module.css"; // Styles
import Loader from "../Loader/Loader"; // Loading spinner
import { db } from "../../Utility/firebase"; // Firestore (user-uploaded products)

// Displays user-uploaded products (from Firestore) followed by the demo catalog.
function Product() {
  const [products, setProducts] = useState([]); // Demo products from FakeStore API
  const [userProducts, setUserProducts] = useState([]); // Products uploaded by users
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the demo catalog once on mount.
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error: " + err);
        setIsLoading(false);
      });
  }, []);

  // Subscribe to user-uploaded products in real time so new items appear instantly.
  useEffect(() => {
    const unsubscribe = db
      .collection("products")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserProducts(items);
        },
        (err) => console.log("firestore error: " + err)
      );

    // Clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  // Show user uploads first, then the demo catalog.
  const allProducts = [...userProducts, ...products];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={classes.product__container}>
          {allProducts?.map((singleProduct) => {
            return (
              <ProductCard
                renderAdd={true}
                key={singleProduct.id}
                product={singleProduct}
                sliceDesc={true}
              />
            );
          })}
        </section>
      )}
    </>
  );
}

export default Product;
