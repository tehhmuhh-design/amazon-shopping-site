// Firebase Cloud Functions - Stripe payment backend for the Amazon clone.
// Exposes an Express app at the `api` function. The React client calls
// POST /payment/create?total=<amountInCents> and expects { clientSecret }.

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// Stripe is initialized with your SECRET key. Never expose this on the client.
// Set it with:  firebase functions:config:set stripe.key="sk_test_xxx"
// For local dev you can fall back to an env var.
const stripeSecret =
  (functions.config().stripe && functions.config().stripe.key) ||
  process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripeSecret);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Amazon clone payment server is live.");
});

// Create a PaymentIntent. `total` arrives already in cents from the client.
app.post("/payment/create", async (req, res) => {
  const total = Number(req.query.total);

  if (!Number.isFinite(total) || total <= 0) {
    return res.status(400).json({ message: "A valid 'total' (in cents) is required." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Exported as `api` -> base URL ends with /api
exports.api = functions.https.onRequest(app);
