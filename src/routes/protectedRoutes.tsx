import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth';
import LandingPage from '../pages/LandingPage';
import ProfilePage from '../pages/ProfilePage';
import UserInterests from '../pages/UserInterests';
import Events from '../pages/Events';
import EditEvent from '../pages/EditEvent';
import CreateEvent from '../pages/CreateEvent';
import MyEvents from '../pages/MyEvents';
import { Friends } from '../pages/Friends';

export const protectedRoutes = [
  <Route key="protected-home" path="/home" element={<ProtectedRoute element={<LandingPage />} />} />,
  <Route key="profile" path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />,
  <Route key="interests" path="/interests" element={<ProtectedRoute element={<UserInterests />} />} />,
  <Route key="events" path="/events" element={<ProtectedRoute element={<Events />} />} />,
  <Route key="edit-event" path="/events/:id/edit" element={<ProtectedRoute element={<EditEvent />} />} />,
  <Route key="new-event" path="/events/new" element={<ProtectedRoute element={<CreateEvent />} />} />,
  <Route key="my-events" path="/events/my" element={<ProtectedRoute element={<MyEvents />} />} />,
  <Route key="friends" path="/friends" element={<ProtectedRoute element={<Friends />} />} />,
];
