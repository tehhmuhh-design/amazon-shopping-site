import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Ensure this name matches Vercel exactly!
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
console.log("MY API KEY IS:", import.meta.env.VITE_FIREBASE_API_KEY);
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = firebase.firestore();
export const storage = firebase.storage();