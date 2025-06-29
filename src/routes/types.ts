import React from 'react';

// Route configuration types and constants
export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  admin?: boolean;
  key: string;
}

// Route paths constants for better maintainability
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  NEARBY_EVENTS: '/nearby-events',
  EVENT_DETAILS: '/events/:id',
  
  // Protected routes
  PROTECTED_HOME: '/home',
  PROFILE: '/profile',
  INTERESTS: '/interests',
  EVENTS: '/events',
  EDIT_EVENT: '/events/:id/edit',
  NEW_EVENT: '/events/new',
  MY_EVENTS: '/events/my',
  FRIENDS: '/friends',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVENTS: '/admin/events',
} as const;
