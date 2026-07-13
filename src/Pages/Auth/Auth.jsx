import React, { useContext, useState } from "react"; // Importing React and necessary hooks
import classes from "./Auth.module.css"; // Importing CSS module for authentication page styles
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importing routing components
import { auth, db } from "../../Utility/firebase"; // Importing Firebase authentication AND database instance
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"; // Importing Firebase authentication methods
import { DataContext } from "../../components/DataProvider/DataProvider"; // Importing context for global state management
import { Type } from "../../Utility/action.type"; // Importing action types for the reducer
import { ClipLoader } from "react-spinners"; // Importing a loading spinner component

function Auth() {
  // State to track email, password, errors, and loading for sign in/up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    signIn: false,
    signUp: false,
  });

  // Accessing global state (user) and dispatch from context
  const [{ user }, dispatch] = useContext(DataContext);

  const navigate = useNavigate(); // Hook for programmatic navigation
  const navStateData = useLocation(); // Hook for accessing state passed with navigation
  console.log(navStateData); // Logging the navigation state for debugging

  // Handler for authentication (sign in or sign up based on button clicked)
  const authHandler = (e) => {
    e.preventDefault(); // Prevent form submission
    setError(""); // Clear any previous errors

    // 🛑 REQUIREMENT 2: Email Validation Check (Must contain '@')
    if (!email.includes("@")) {
      setError("Invalid email address. It must contain an '@' symbol.");
      return; // Stop the function from proceeding
    }

    if (e.target.name === "signIn") {
      // Handle Sign In
      setLoading({ ...loading, signIn: true });
      signInWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          // 💾 REQUIREMENT 1: Store inputted data into Firestore Database
          db.collection("userInputs").add({
            emailInput: email,
            action: "signIn",
            timestamp: new Date(),
          }).catch((err) => console.error("Database save error:", err));

          // Successful sign-in
          dispatch({
            type: Type.SET_USER,
            user: userInfo.user,
          });
          setLoading({ ...loading, signIn: false });
          navigate(navStateData?.state?.redirect || "/");
        })
        .catch((err) => {
          setError(err.message);
          setLoading({ ...loading, signIn: false });
        });
    } else {
      // Handle Sign Up
      setLoading({ ...loading, signUp: true });
      createUserWithEmailAndPassword(auth, email, password)
        .then((userInfo) => {
          // 💾 REQUIREMENT 1: Store inputted data into Firestore Database
          db.collection("userInputs").add({
            emailInput: email,
            action: "signUp",
            timestamp: new Date(),
          }).catch((err) => console.error("Database save error:", err));

          // Successful sign-up
          dispatch({
            type: Type.SET_USER,
            user: userInfo.user,
          });
          setLoading({ ...loading, signUp: false });
          navigate(navStateData?.state?.redirect || "/");
        })
        .catch((err) => {
          setError(err.message);
          setLoading({ ...loading, signUp: false });
        });
    }
  };

  return (
    <section className={classes.auth}>
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Amazon_2024.svg/1280px-Amazon_2024.svg.png"
          alt="amazon logo"
        />
      </Link>

      <div className={classes.auth__container}>
        <h1>Sign In</h1>
        {navStateData?.state?.msg && (
          <small className={classes.auth__msg_login}>
            {navStateData?.state?.msg}
          </small>
        )}

        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
          </div>
          <button
            type="submit"
            onClick={authHandler}
            name="signIn"
            className={classes.auth__signIn_btn}
          >
            {loading.signIn ? <ClipLoader color="#000" size={15} /> : "Sign In"}
          </button>
        </form>

        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice, Cookies Notice, and our
          Interest-based Ads Notice.
        </p>

        <button
          type="submit"
          onClick={authHandler}
          name="signUp"
          className={classes.auth__signUp_btn}
        >
          {loading.signUp ? (
            <ClipLoader color="#000" size={15} />
          ) : (
            "Create your Amazon Account"
          )}
        </button>

        {error && <small className={classes.auth__error}>{error}</small>}
      </div>
    </section>
  );
}

export default Auth;