import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('access_token'); // Check token in localStorage

  // If token exists, render the element; otherwise, redirect to login page
  return token ? element : <Navigate to="/" />;
};

export default ProtectedRoute;