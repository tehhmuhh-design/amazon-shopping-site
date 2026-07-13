import firebase from "firebase/compat/app"; // Import the compat version of Firebase
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore"; // Import Firestore compat
import "firebase/compat/auth"; // Import Auth compat
import "firebase/compat/storage"; // Import Storage compat (for product image uploads)

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBGHVU6qJ3cb30dFvmPqbvE4vbbfufT3v0",

  authDomain: "shoppingstite.firebaseapp.com",

  projectId: "shoppingstite",

  storageBucket: "shoppingstite.firebasestorage.app",

  messagingSenderId: "740873917598",

  appId: "1:740873917598:web:48d0138410671836d6d78f",

  measurementId: "G-5F2MX43EVD"

};


// Initialize Firebase using the compat version
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app); // Authentication instance (used with modular auth functions)
export const db = firebase.firestore(); // Firestore database (compat API)
export const storage = firebase.storage(); // Cloud Storage (compat API) for image uploads