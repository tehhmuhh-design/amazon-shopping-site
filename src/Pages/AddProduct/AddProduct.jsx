import React, { useState } from "react";
import classes from "./AddProduct.module.css"; // Ensure this matches your CSS file name
import { db } from "../../Utility/firebase"; // Direct import of your Firestore db instance
import { collection, addDoc } from "firebase/firestore";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Changed to hold the text URL string
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!imageUrl.startsWith("http")) {
      alert("Please enter a valid image URL from gaac.vercel.app");
      setLoading(false);
      return;
    }

    try {
      // Direct JSON storage into your Firestore Database (Spark Plan Friendly!)
      await addDoc(collection(db, "products"), {
        title: title,
        price: Number(price),
        category: category,
        description: description,
        image: imageUrl, // Saving the text URL directly
        createdAt: new Date(),
      });

      alert("Product successfully added to Amazon database!");
      
      // Clear fields after success
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Database error: Could not save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.addProduct}>
      <div className={classes.addProduct__container}>
        <h2>Add a New Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              placeholder="e.g., electronics, clothing"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="image">Product Image URL</label>
            <input
              type="text"
              id="image"
              placeholder="Paste the CDN link from gaac.vercel.app here"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddProduct;