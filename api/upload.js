import { put } from '@vercel/blob';

export default async function handler(request, response) {
  // block anything that isn't a POST request
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the filename from the URL query or default it
    const filename = request.query.filename || 'product-image.jpg';
    
    // Upload the file directly to Vercel Blob
    const blob = await put(filename, request, {
      access: 'public',
    });

    // Send back the live link to your frontend
    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}