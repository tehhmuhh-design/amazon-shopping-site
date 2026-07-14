import React, { useState } from "react";
import classes from "./AddProduct.module.css";
import { db } from "../../Utility/firebase"; // Compat Firestore instance

function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // Holds the actual File object
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!imageFile) {
      setMessage({ type: "error", text: "Please select a product image file first." });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload the chosen file to your Vercel Blob Storage API route.
      //    NOTE: /api/upload only exists on your deployed Vercel URL. When running
      //    locally on localhost:5173 this call will fail unless you also run the
      //    Vercel dev server (`vercel dev`) or point it at your deployed endpoint.
      const uploadResponse = await fetch(
        `/api/upload?filename=${encodeURIComponent(imageFile.name)}`,
        {
          method: "POST",
          body: imageFile,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to storage.");
      }

      const blobData = await uploadResponse.json();
      const uploadedImageUrl = blobData.url; // Live Vercel CDN link

      // 2. Store the product in Firestore (compat API — matches your firebase.js)
      await db.collection("products").add({
        title: title,
        price: Number(price),
        category: category,
        description: description,
        image: uploadedImageUrl,
        createdAt: new Date(),
      });

      setMessage({ type: "success", text: "Product successfully added to the catalog." });

      // Clear fields after success
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageFile(null);
      e.target.reset(); // Resets the file picker UI
    } catch (error) {
      console.error("Error adding product: ", error);
      setMessage({
        type: "error",
        text: "Could not save product. Check your upload endpoint and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.addProduct}>
      <div className={classes.addProduct__container}>
        <h1 className={classes.addProduct__title}>Add a New Product</h1>
        <p className={classes.addProduct__subtitle}>
          Fill in the details below to list a new item in your store.
        </p>

        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.form__group}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wireless Headphones"
              required
            />
          </div>

          <div className={classes.form__group}>
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className={classes.form__group}>
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

          <div className={classes.form__group}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product..."
              required
            />
          </div>

          <div className={classes.form__group}>
            <label htmlFor="image">Product Image</label>
            <input
              className={classes.form__file}
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
            {imageFile && (
              <span className={classes.form__fileName}>{imageFile.name}</span>
            )}
          </div>

          <button type="submit" className={classes.form__submit} disabled={loading}>
            {loading ? "Uploading & Saving..." : "Add Product"}
          </button>

          {message && (
            <small
              className={
                message.type === "success"
                  ? classes.message__success
                  : classes.message__error
              }
            >
              {message.text}
            </small>
          )}
        </form>
      </div>
    </section>
  );
}

export default AddProduct;