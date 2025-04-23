import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  // Optional: block route if accessToken is missing entirely
  if (!accessToken && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Optional: render loading UI if you still plan to verify via /auth/me
  // (skip this if your `AuthBootstrap` and refresh token already cover it)
  if (isAuthenticated === false) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;