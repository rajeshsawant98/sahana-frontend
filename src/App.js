import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';  // Import LandingPage component
import LoginPage from './pages/LoginPage';  // Import the combined LoginPage component
import SignUpComponent from './components/SignUpComponent';  // Import your SignUp component
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import UserPreferences from './pages/UserPreferences';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="505025857168-olhtcsvr2pmpu84k0gb25rkh61qksbm8.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpComponent />} />
          
          {/* Protected Route */}
          <Route 
            path="/home" 
            element={<ProtectedRoute element={<LandingPage />} />} 
          />
           <Route 
            path="/profile" 
            element={<ProtectedRoute element={<ProfilePage />} />} 
          />
           <Route 
            path="/preferences" 
            element={<ProtectedRoute element={<UserPreferences />} />} 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;