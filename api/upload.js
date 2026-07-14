import { put } from "@vercel/blob";

// Vercel Serverless Function (Node runtime) for a Vite + React project.
// Lives at /api/upload.js -> reachable at /api/upload on Vercel.
//
// The browser POSTs the raw file as the request body with ?filename=... in the URL.
// This forwards it to Vercel Blob and returns the public URL.
//
// NOTE: This server-upload path is subject to Vercel's 4.5 MB request body limit.
// For larger files, switch to the client-upload flow.

export default async function handler(request, response) {
  // Block anything that isn't a POST request
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the filename from the URL query, with a sensible fallback.
    const filename = request.query.filename || "product-image.jpg";

    // Upload the raw request stream to Vercel Blob.
    // addRandomSuffix prevents a second "image.jpg" from overwriting the first.
    const blob = await put(filename, request, {
      access: "public",
      addRandomSuffix: true,
    });

    // Send back the live CDN link to your frontend.
    return response.status(200).json(blob);
  } catch (error) {
    console.error("Blob upload error:", error);
    return response.status(500).json({ error: error.message });
  }
}