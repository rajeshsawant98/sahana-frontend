import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth';
import { AdminRoute } from '../components/admin';
import { CircularProgress, Box } from '@mui/material';

// Lazy-loaded pages
const LandingPage = React.lazy(() => import('../pages/LandingPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const SignUpComponent = React.lazy(() => import('../components/auth/SignUpComponent'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const UserInterests = React.lazy(() => import('../pages/UserInterests'));
const EditEvent = React.lazy(() => import('../pages/EditEvent'));
const EventDetails = React.lazy(() => import('../pages/EventDetails'));
const CreateEvent = React.lazy(() => import('../pages/CreateEvent'));
const Friends = React.lazy(() => import('../pages/Friends'));
const EventsPage = React.lazy(() => import('../pages/EventsPage'));
const MyEventsPage = React.lazy(() => import('../pages/MyEventsPage'));
const NearbyEventsPage = React.lazy(() => import('../pages/NearbyEventsPage'));
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const ManageUsers = React.lazy(() => import('../pages/admin/ManageUsers'));
const ManageEvents = React.lazy(() => import('../pages/admin/ManageEvents'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpComponent />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/events" element={<EventsPage />} />

      {/* Protected User Routes */}
      <Route path="/home" element={<ProtectedRoute element={<LandingPage />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="/interests" element={<ProtectedRoute element={<UserInterests />} />} />
      {/* Main routes now use infinite scroll */}
      <Route path="/events/:id/edit" element={<ProtectedRoute element={<EditEvent />} />} />
      <Route path="/events/new" element={<ProtectedRoute element={<CreateEvent />} />} />
      <Route path="/events/my" element={<ProtectedRoute element={<MyEventsPage />} />} />
      <Route path="/friends" element={<ProtectedRoute element={<Friends />} />} />
      <Route path="/events/nearby" element={<NearbyEventsPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/admin/users" element={<AdminRoute element={<ManageUsers />} />} />
      <Route path="/admin/events" element={<AdminRoute element={<ManageEvents />} />} />
    </Routes>
    </Suspense>
  );
};
