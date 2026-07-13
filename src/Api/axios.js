import axios from "axios";

// Base URL of your deployed Firebase Function (the Express app exported as `api`).
// Replace YOUR_PROJECT_ID / region to match your Firebase project, e.g.:
//   https://us-central1-amazon-clone-12345.cloudfunctions.net/api
//
// For local development against the emulator, use something like:
//   http://127.0.0.1:5001/YOUR_PROJECT_ID/us-central1/api
export const axiosInstance = axios.create({
  baseURL: "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api",
});
