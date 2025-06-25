import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AdminRouteProps {
  element: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { isAuthenticated, accessToken, initialized, role } = useSelector(
    (state: RootState) => state.auth
  );

  if (!initialized) return <div>Loading...</div>;

  if (!isAuthenticated || role !== "admin") return <Navigate to="/" />;

  return <>{element}</>;
};

export default AdminRoute;