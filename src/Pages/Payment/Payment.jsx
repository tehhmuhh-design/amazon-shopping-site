import React, { useContext, useState } from "react";
import LayOut from "../../components/LayOut/LayOut"; // Layout (header) wrapper
import classes from "./Payment.module.css"; // Styles
import { DataContext } from "../../components/DataProvider/DataProvider"; // Global state
import ProductCard from "../../components/Product/ProductCard"; // Renders basket items
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"; // Stripe card field
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat"; // Currency formatting
import { ClipLoader } from "react-spinners"; // Loading spinner
import { db } from "../../Utility/firebase"; // Firestore (where orders are stored)
import { useNavigate } from "react-router-dom"; // Navigation
import { Type } from "../../Utility/action.type"; // Reducer action types

// Checkout page. When the user enters a (test) card and clicks save, the order
// and the card's safe details are written straight to Firestore so they can be
// viewed in the Firebase console. This does NOT charge the card — there is no
// Stripe backend / PaymentIntent — it validates the card and stores safe
// metadata (brand + last4) alongside the order for testing/demo purposes.
function Payment() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  const total = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const [cardError, setCardError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false); // true when the card field is fully valid
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Track validation state AND completeness of the card field.
  const handleChange = (e) => {
    setCardError(e?.error?.message || "");
    setCardComplete(e?.complete || false);
  };

  // Validate the card, then save the order (with card brand/last4) to Firestore.
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!basket || basket.length === 0) {
      setCardError("Your basket is empty.");
      return;
    }

    // Require Stripe to be ready and the card field to be complete before saving.
    if (!stripe || !elements) {
      setCardError("Payment form is still loading. Please wait a moment.");
      return;
    }

    if (!cardComplete) {
      setCardError("Please enter complete card details before saving.");
      return;
    }

    try {
      setProcessing(true);
      setCardError("");

      // Read + validate the card. Returns SAFE metadata (brand + last4 only);
      // the full card number is never exposed for PCI/security reasons.
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      // If the card is invalid, STOP — do not save a broken order.
      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      const c = paymentMethod.card;
      const cardMeta = {
        brand: c.brand,
        last4: c.last4,
        expMonth: c.exp_month,
        expYear: c.exp_year,
        paymentMethodId: paymentMethod.id,
      };

      // The order document that gets stored in Firestore.
      const orderData = {
        basket: basket,
        amount: total,
        amountCents: Math.round(total * 100),
        email: user?.email || null,
        uid: user?.uid || null,
        card: cardMeta,
        paymentStatus: "saved",
        created: Date.now(),
      };

      // 1) Top-level "orders" collection — easy to view every order in the console.
      const orderRef = await db.collection("orders").add(orderData);

      // 2) Also store it under the user so the "Your Orders" page shows it.
      if (user?.uid) {
        await db
          .collection("users")
          .doc(user.uid)
          .collection("orders")
          .doc(orderRef.id)
          .set(orderData);
      }

      // Empty the basket and go to the orders page.
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
      {/* Header displaying the number of items in the basket */}
      <div className={classes.payment__header}>
        Checkout ({totalItem}) items
      </div>

      {/* Payment section */}
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

        {/* Review items and delivery */}
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

        {/* Payment method section */}
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

                {/* Stripe CardElement for card details input */}
                <CardElement onChange={handleChange} />
                <div className={classes.payment__price}>
                  <div>
                    <span>
                      Total Order | <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing || !cardComplete}>
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