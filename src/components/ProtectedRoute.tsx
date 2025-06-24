import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  element: React.JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, accessToken, initialized } = useSelector(
    (state: RootState) => state.auth
  );

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;