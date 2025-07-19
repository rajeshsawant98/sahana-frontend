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
import EditEvent from '../pages/EditEvent';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/CreateEvent';
import { Friends } from '../pages/Friends';

// Infinite scroll pages (now the default)
import EventsPage from '../pages/EventsPage';
import MyEventsPage from '../pages/MyEventsPage';
import NearbyEventsPage from '../pages/NearbyEventsPage';

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
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Protected User Routes */}
      <Route path="/home" element={<ProtectedRoute element={<LandingPage />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="/interests" element={<ProtectedRoute element={<UserInterests />} />} />
      {/* Main routes now use infinite scroll */}
      <Route path="/events" element={<ProtectedRoute element={<EventsPage />} />} />
      <Route path="/events/:id/edit" element={<ProtectedRoute element={<EditEvent />} />} />
      <Route path="/events/new" element={<ProtectedRoute element={<CreateEvent />} />} />
      <Route path="/events/my" element={<ProtectedRoute element={<MyEventsPage />} />} />
      <Route path="/friends" element={<ProtectedRoute element={<Friends />} />} />
      
      {/* Infinite scroll routes with descriptive paths */}
      <Route path="/events-infinite" element={<ProtectedRoute element={<EventsPage />} />} />
      <Route path="/events/my-infinite" element={<ProtectedRoute element={<MyEventsPage />} />} />
      <Route path="/events/nearby" element={<NearbyEventsPage />} />

      {/* Legacy route redirects for backward compatibility */}
      <Route path="/nearby-events" element={<NearbyEventsPage />} />
      <Route path="/events/nearby-infinite" element={<NearbyEventsPage />} />
      
      {/* Create Event route */}
      <Route path="/create-event" element={<ProtectedRoute element={<CreateEvent />} />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/admin/users" element={<AdminRoute element={<ManageUsers />} />} />
      <Route path="/admin/events" element={<AdminRoute element={<ManageEvents />} />} />
    </Routes>
  );
};
