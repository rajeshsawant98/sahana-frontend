import React from 'react';
import { Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import { SignUpComponent } from '../components/auth';
import NearbyEventsPage from '../pages/NearbyEventsPage';
import EventDetails from '../pages/EventDetails';

export const publicRoutes = [
  <Route key="home" path="/" element={<LandingPage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="signup" path="/signup" element={<SignUpComponent />} />,
  <Route key="nearby" path="/nearby-events" element={<NearbyEventsPage />} />,
  <Route key="event-details" path="/events/:id" element={<EventDetails />} />,
];
