import React, { useState } from "react";
import classes from "./AddProduct.module.css"; // Ensure this matches your CSS file name
import { db } from "../../Utility/firebase"; // Direct import of your Firestore db instance
import { collection, addDoc } from "firebase/firestore";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // CHANGED: Holds the actual file object now
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert("Please select a product image file first.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload the chosen file to your Vercel Blob Storage API route
      const uploadResponse = await fetch(`/api/upload?filename=${imageFile.name}`, {
        method: "POST",
        body: imageFile,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to storage.");
      }

      const blobData = await uploadResponse.json();
      const uploadedImageUrl = blobData.url; // This is your live Vercel CDN link!

      // 2. Direct JSON storage into your Firestore Database (Spark Plan Friendly!)
      await addDoc(collection(db, "products"), {
        title: title,
        price: Number(price),
        category: category,
        description: description,
        image: uploadedImageUrl, // Saving the freshly generated Vercel link!
        createdAt: new Date(),
      });

      alert("Product successfully added to Amazon database!");
      
      // Clear fields after success
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageFile(null);
      e.target.reset(); // Resets the HTML file picker UI input field
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

          {/* CHANGED: Swapped from text string pasting to local file picker */}
          <div>
            <label htmlFor="image">Product Image File</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Uploading & Saving..." : "Add Product"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddProduct;