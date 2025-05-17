import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, accessToken, initialized } = useSelector((state) => state.auth);

  // ⏳ Wait for AuthBootstrap to finish checking refresh token
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // ❌ If not authenticated even after checking
  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;