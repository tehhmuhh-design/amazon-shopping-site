import React, { useContext, useState } from "react";
import LayOut from "../../components/LayOut/LayOut"; // Layout (header) wrapper
import classes from "./Payment.module.css"; // Styles
import { DataContext } from "../../components/DataProvider/DataProvider"; // Global state
import ProductCard from "../../components/Product/ProductCard"; // Renders basket items
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat"; // Currency formatting
import { ClipLoader } from "react-spinners"; // Loading spinner
import { db } from "../../Utility/firebase"; // Firestore (where orders are stored)
import { useNavigate } from "react-router-dom"; // Navigation
import { Type } from "../../Utility/action.type"; // Reducer action types

// Checkout page (school-project version).
//
// NOTE: This intentionally captures and stores the FULL card number, expiry and
// CVC in Firestore. This is ONLY acceptable because these are FAKE test cards in
// an educational project. A real production app must NEVER store full card
// numbers or CVCs -- that violates PCI-DSS and is illegal. For real payments you
// would use a processor like Stripe, which keeps the sensitive data for you.
function Payment() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  const total = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  // Plain card fields we control (so we can read + save everything typed).
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  // Format the card number as the user types: digits only, grouped in 4s.
  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16); // max 16 digits
    const grouped = digits.replace(/(.{4})/g, "$1 ").trim(); // "4242 4242 4242 4242"
    setCardNumber(grouped);
  };

  // Format expiry as MM/YY while typing.
  const handleExpiryChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setExpiry(formatted);
  };

  const handleCvcChange = (e) => {
    setCvc(e.target.value.replace(/\D/g, "").slice(0, 4)); // 3-4 digits
  };

  // Basic completeness check before saving.
  const isCardComplete = () => {
    const rawNumber = cardNumber.replace(/\s/g, "");
    return (
      rawNumber.length >= 15 && // 15 (Amex) or 16 digits
      /^\d{2}\/\d{2}$/.test(expiry) &&
      cvc.length >= 3
    );
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setCardError("");

    if (!basket || basket.length === 0) {
      setCardError("Your basket is empty.");
      return;
    }

    if (!isCardComplete()) {
      setCardError("Please enter a complete card number, expiry (MM/YY) and CVC.");
      return;
    }

    try {
      setProcessing(true);

      const rawNumber = cardNumber.replace(/\s/g, "");

      // Store the (fake) card details. See the file-top note about why this is
      // only OK for a school project with test cards.
      const cardData = {
        nameOnCard: cardName || null,
        number: rawNumber, // full fake card number
        last4: rawNumber.slice(-4),
        expiry: expiry, // "MM/YY"
        cvc: cvc, // fake CVC
      };

      // Normalize basket items so no field is ever `undefined` (Firestore rejects those).
      const safeBasket = (basket || []).map((item) => ({
        id: item.id ?? null,
        title: item.title ?? null,
        image: item.image ?? null,
        price: item.price ?? 0,
        amount: item.amount ?? 1,
        description: item.description ?? null,
        rating: item.rating ?? null,
        sellerId: item.sellerId ?? null,
      }));

      const orderData = {
        basket: safeBasket,
        amount: total ?? 0,
        amountCents: Math.round((total ?? 0) * 100),
        email: user?.email || null,
        uid: user?.uid || null,
        card: cardData,
        paymentStatus: "saved",
        created: Date.now(),
      };

      // Belt-and-suspenders: strip any remaining undefined anywhere in the doc.
      const clean = JSON.parse(JSON.stringify(orderData));

      // 1) Top-level "orders" collection.
      const orderRef = await db.collection("orders").add(clean);

      // 2) Also store under the user so the "Your Orders" page shows it.
      if (user?.uid) {
        await db
          .collection("users")
          .doc(user.uid)
          .collection("orders")
          .doc(orderRef.id)
          .set(clean);
      }

      dispatch({ type: Type.EMPTY_BASKET });
      setProcessing(false);
      navigate("/orders", { state: { msg: "You have placed a new order" } });
    } catch (error) {
      setCardError(error.message || "Could not save your order. Try again.");
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.payment__header}>
        Checkout ({totalItem}) items
      </div>

      <section className={classes.payment__method__wrapper}>
        {/* Delivery information */}
        <div
          className={`${classes.payment__deliveryInfo} ${classes.payment__flex}`}
        >
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Ethiopia, IL</div>
          </div>
        </div>
        <hr />

        {/* Review items */}
        <div
          className={`${classes.payment__deliveryItem} ${classes.payment__flex}`}
        >
          <h3>Review items and Delivery</h3>
          <div>
            {basket?.map((item, i) => (
              <ProductCard key={i} product={item} flex={true} titleUp={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment method */}
        <div className={`${classes.payment__card} ${classes.payment__flex}`}>
          <h3>Payment methods</h3>
          <div className={classes.payment__card_methods}>
            <div className={classes.payment__card_details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <small className={classes.payment__card_error}>
                    {cardError}
                  </small>
                )}

                <div className={classes.payment__fields}>
                  <label>
                    Name on card
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </label>

                  <label>
                    Card number
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                    />
                  </label>

                  <div className={classes.payment__row}>
                    <label>
                      Expiry (MM/YY)
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="12/34"
                      />
                    </label>

                    <label>
                      CVC
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                      />
                    </label>
                  </div>
                </div>

                <div className={classes.payment__price}>
                  <div>
                    <span>
                      Total Order | <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing}>
                    {processing ? (
                      <div className={classes.payment__card_details_loader}>
                        <ClipLoader color="#000" size={12} />
                        <p>Please wait .... </p>
                      </div>
                    ) : (
                      "Save & Pay"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;