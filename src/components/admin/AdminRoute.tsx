import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface AdminRouteProps {
  element: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { isAuthenticated, accessToken, initialized, role, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!initialized) return <div>Loading...</div>;

  // Check both the role field and user.role for consistency
  const userRole = user?.role || role;
  if (!isAuthenticated || userRole !== "admin") return <Navigate to="/" />;

  return <>{element}</>;
};

export default AdminRoute;