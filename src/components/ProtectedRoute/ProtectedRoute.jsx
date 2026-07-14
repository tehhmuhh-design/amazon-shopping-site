import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";

// Guards routes that require authentication.
// - Does NOT render children while unauthenticated (prevents a one-frame flash
//   of protected content before the redirect fires).
// - Waits for `authLoading` to finish so a logged-in user who refreshes on a
//   protected page isn't wrongly bounced to /auth before Firebase reports state.
function ProtectedRoute({ children, msg, redirect }) {
  const navigate = useNavigate();
  const [{ user, authLoading }] = useContext(DataContext);

  useEffect(() => {
    // Only redirect once we KNOW there is no user (auth check complete).
    if (!authLoading && !user) {
      navigate("/auth", { state: { msg, redirect } });
    }
  }, [user, authLoading, navigate, msg, redirect]);

  // While Firebase is still resolving the session, render nothing (or a loader).
  if (authLoading) return null;

  // Not logged in: render nothing; the effect above handles the redirect.
  if (!user) return null;

  // Authenticated: render the protected page.
  return children;
}

export default ProtectedRoute;