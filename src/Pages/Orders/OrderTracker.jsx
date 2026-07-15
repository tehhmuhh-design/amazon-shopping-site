import React, { useEffect, useState } from "react";
import classes from "./OrderTracker.module.css";

// Amazon-style order tracker. Reads the order's `created` timestamp and works
// out which stage the order is in based on elapsed time — no backend needed.
//
// Demo-friendly timings so you can WATCH it progress: change these to real
// durations (hours/days) later if you want.
const STAGES = [
  { key: "ordered", label: "Ordered", afterMs: 0 },
  { key: "shipped", label: "Shipped", afterMs: 20 * 1000 }, // 20s
  { key: "out", label: "Out for delivery", afterMs: 45 * 1000 }, // 45s
  { key: "delivered", label: "Delivered", afterMs: 90 * 1000 }, // 90s
];

function OrderTracker({ created }) {
  // Re-render every few seconds so the bar advances live during a demo.
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(interval);
  }, []);

  if (!created) return null;

  const elapsed = now - created;

  // The current stage is the last one whose threshold has passed.
  let currentIndex = 0;
  STAGES.forEach((stage, i) => {
    if (elapsed >= stage.afterMs) currentIndex = i;
  });

  const isDelivered = currentIndex === STAGES.length - 1;

  // Friendly status line above the bar.
  const statusLine = isDelivered
    ? "Delivered"
    : `Arriving soon — your order is ${STAGES[currentIndex].label.toLowerCase()}`;

  return (
    <div className={classes.tracker}>
      <p
        className={`${classes.tracker__status} ${
          isDelivered ? classes.tracker__status_done : ""
        }`}
      >
        {statusLine}
      </p>

      <div className={classes.tracker__bar}>
        {STAGES.map((stage, i) => {
          const done = i <= currentIndex;
          return (
            <div key={stage.key} className={classes.tracker__step}>
              {/* Connecting line (not before the first dot) */}
              {i > 0 && (
                <div
                  className={`${classes.tracker__line} ${
                    i <= currentIndex ? classes.tracker__line_done : ""
                  }`}
                />
              )}
              <div className={classes.tracker__stepInner}>
                <div
                  className={`${classes.tracker__dot} ${
                    done ? classes.tracker__dot_done : ""
                  }`}
                >
                  {done ? "✓" : ""}
                </div>
                <span
                  className={`${classes.tracker__label} ${
                    done ? classes.tracker__label_done : ""
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTracker;