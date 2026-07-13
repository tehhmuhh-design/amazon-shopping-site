# Amazon Clone — Handoff & Firebase Setup Guide

Hi! 👋 The **frontend is finished and wired up**. Your job is the **Firebase
setup** (about 10 minutes). Everything the app needs from Firebase is listed
below, plus where to view the data once it's running.

---

## ✅ What already works (no action needed)

- Product catalog (demo products from FakeStore API + user-uploaded products)
- Search, cart, product detail pages
- Sign in / sign up screens (Firebase Email/Password)
- **"Sell on Amazon"** page (`/add-product`) — uploads a product to Firestore
- **Checkout** that saves the order + card details to Firestore on save

---

## 🔧 What YOU need to do (Firebase)

### 1. Create a Firebase project
- Go to https://console.firebase.google.com → **Add project**.

### 2. Enable Email/Password login  ← makes sign in / sign up work
- **Build → Authentication → Get started**
- **Sign-in method** tab → **Email/Password** → **Enable** → Save.

### 3. Create the database
- **Build → Firestore Database → Create database** → start in **test mode**
  (you can lock it down later with the rules in step 6).

### 4. Paste your config into the app
- **Project settings (gear icon) → Your apps → Web app** (create one if needed).
- Copy the `firebaseConfig` object and paste it over the one in:
  ```
  src/Utility/firebase.js
  ```
  (look for the line marked with 👉). Nothing else in that file needs to change.

### 5. (Optional) Enable Storage — only for uploading image *files*
- **Build → Storage → Get started.**
- Newer Firebase projects require the **Blaze (pay-as-you-go)** plan to enable
  Storage. If you don't want that, **skip this** — the Sell page also accepts an
  **image URL**, which works with Firestore alone.

### 6. Security rules (paste into Firestore → Rules → Publish)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can view products; only logged-in users can add them.
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders: a logged-in user can create orders; reads are open so the
    // demo Orders page works. Tighten later if you want.
    match /orders/{id} {
      allow read: if true;
      allow create: if request.auth != null;
    }

    // Per-user order history.
    match /users/{uid}/orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 👀 Where to VIEW the data (Firebase console → Firestore Database)

| What | Collection |
|------|------------|
| Products people upload | **`products`** |
| **Orders + the card used** | **`orders`** (every order, easiest to browse) |
| Per-user order history | `users / {userId} / orders` |

### About the stored card data
Each order in `orders` looks like this:
```json
{
  "amount": 49.99,
  "amountCents": 4999,
  "email": "buyer@example.com",
  "uid": "abc123...",
  "card": { "brand": "visa", "last4": "4242", "expMonth": 12, "expYear": 2030 },
  "paymentStatus": "saved",
  "basket": [ ...items... ],
  "created": 1719500000000
}
```
> ⚠️ Note: only the card **brand + last 4 digits** are stored. Stripe never
> exposes the full card number to the browser (PCI security) — this is correct
> and intentional. Storing full card numbers would be unsafe and is not done.

---

## 🧪 How to test the "enter a fake card → it saves" flow

```bash
cd amazon-clone
npm install        # frontend deps
npm run dev        # http://localhost:5173
```
1. Click **Sign In** → create an account (works after step 2 above).
2. Add any product to the cart → go to the cart → **Proceed to checkout**.
3. On the payment page, enter the Stripe **test card**:
   - Number: `4242 4242 4242 4242`
   - Expiry: any future date (e.g. `12/30`)
   - CVC: any 3 digits · ZIP: any 5 digits
4. Click **Save & Pay**.
5. ✅ The order now appears in Firestore under **`orders`** (and on the
   in-app **Your Orders** page). The card brand + last4 are saved with it.

Other Stripe test cards: `5555 5555 5555 4444` (Mastercard),
`3782 822463 10005` (Amex). Even if the card field errors, the order is still
saved with `paymentStatus: "card_error"` so it always shows up in the backend.

---

## 💳 (Optional, advanced) Real Stripe charges via Cloud Functions

The current save flow does **not** need a backend. If you later want to actually
charge cards, there's a ready-made backend in the **`functions/`** folder:

1. `cd functions && npm install`
2. Set your Stripe secret key:
   `firebase functions:config:set stripe.key="sk_test_..."`
3. Deploy: `firebase deploy --only functions` (needs the Blaze plan).
4. Put your deployed function URL as the `baseURL` in `src/Api/axios.js`.
5. Put your Stripe **publishable** key in `src/Router.jsx` (replace the
   `loadStripe("pk_test_...")` value).

Then you can switch the checkout to confirm a real PaymentIntent. (Ask me/Notion
AI for the snippet if you go this route.)

---

## 📁 Files that were added or changed in this project

**New files**
- `src/Pages/AddProduct/AddProduct.jsx` + `AddProduct.module.css` — Sell page
- `src/components/Loader/Loader.jsx` — loading spinner
- `src/App.css` — base styles
- `src/components/Carousel/imgs/data.js` — homepage banner images
- `src/assets/icons/amazon-logo-white.png` — header logo
- `functions/index.js` + `functions/package.json` — optional Stripe backend
- `src/Api/axios.js`, `src/Api/endPoints.js`

**Changed files**
- `src/Utility/firebase.js` — added Storage; 👉 paste your config here
- `src/Pages/Payment/Payment.jsx` — saves order + card to Firestore on save
- `src/components/Product/Product.jsx` — shows uploaded products in real time
- `src/Pages/ProductDetail/ProductDetail.jsx` — supports uploaded products
- `src/Router.jsx` — added protected `/add-product` route
- `src/components/Header/Header.jsx` — added "Sell on Amazon" link
- `eslint.config.js`, `package.json` — lint fix + removed a bogus dependency
- `src/index.css` — font path fix

---

## 🏃 Run commands cheat sheet
```bash
# Frontend (the storefront)
cd amazon-clone
npm install
npm run dev

# Optional Stripe backend
cd amazon-clone/functions
npm install
npm run serve      # local emulator (note: there is NO "dev" script here)
```

That's it — once steps 1–4 are done, login, product uploads, and the
save-card-to-backend checkout all work. 🎉
