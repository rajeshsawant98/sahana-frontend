import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth';
import { AdminRoute } from '../components/admin';

// Page imports
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import { SignUpComponent } from '../components/auth';
import ProfilePage from '../pages/ProfilePage';
import UserInterests from '../pages/UserInterests';
import Events from '../pages/Events';
import EditEvent from '../pages/EditEvent';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/CreateEvent';
import MyEvents from '../pages/MyEvents';
import NearbyEventsPage from '../pages/NearbyEventsPage';
import { Friends } from '../pages/Friends';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageEvents from '../pages/admin/ManageEvents';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpComponent />} />
      <Route path="/nearby-events" element={<NearbyEventsPage />} />
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Protected User Routes */}
      <Route path="/home" element={<ProtectedRoute element={<LandingPage />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="/interests" element={<ProtectedRoute element={<UserInterests />} />} />
      <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
      <Route path="/events/:id/edit" element={<ProtectedRoute element={<EditEvent />} />} />
      <Route path="/events/new" element={<ProtectedRoute element={<CreateEvent />} />} />
      <Route path="/events/my" element={<ProtectedRoute element={<MyEvents />} />} />
      <Route path="/friends" element={<ProtectedRoute element={<Friends />} />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/admin/users" element={<AdminRoute element={<ManageUsers />} />} />
      <Route path="/admin/events" element={<AdminRoute element={<ManageEvents />} />} />
    </Routes>
  );
};
