import React, { useEffect, useState } from "react";
import { productUrl } from "../../Api/endPoints"; // FakeStore API base URL
import LayOut from "../../components/LayOut/LayOut"; // Layout wrapper
import { useParams } from "react-router-dom"; // Route params
import ProductCard from "../../components/Product/ProductCard"; // Product display
import Loader from "../../components/Loader/Loader"; // Loading spinner
import axios from "axios"; // HTTP client
import { db } from "../../Utility/firebase"; // Firestore (user-uploaded products)

// Shows the details of a single product (works for both demo and uploaded items).
function ProductDetail() {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Numeric ids belong to the FakeStore demo catalog; anything else is a
    // user-uploaded product stored in Firestore (which uses string ids).
    if (/^\d+$/.test(productId)) {
      axios
        .get(`${productUrl}/products/${productId}`)
        .then((res) => {
          setProduct(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      db.collection("products")
        .doc(productId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setProduct({ id: doc.id, ...doc.data() });
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [productId]);

  return (
    <LayOut>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductCard
          key={product.id}
          titleUp={true}
          product={product}
          flex={true}
          add_description={true}
          add_button={true}
          renderAdd={true}
        />
      )}
    </LayOut>
  );
}

export default ProductDetail;
