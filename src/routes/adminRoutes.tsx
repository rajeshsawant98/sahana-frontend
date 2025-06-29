import React from 'react';
import { Route } from 'react-router-dom';
import { AdminRoute } from '../components/admin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageEvents from '../pages/admin/ManageEvents';

export const adminRoutes = [
  <Route key="admin-dashboard" path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />,
  <Route key="admin-users" path="/admin/users" element={<AdminRoute element={<ManageUsers />} />} />,
  <Route key="admin-events" path="/admin/events" element={<AdminRoute element={<ManageEvents />} />} />,
];
