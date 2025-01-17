import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';  // Import HomePage component
import LoginPage from './pages/LoginPage';  // Import the combined LoginPage component
import SignUpComponent from './components/SignUpComponent';  // Import your SignUp component
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

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
            element={<ProtectedRoute element={<HomePage />} />} 
          />
           <Route 
            path="/profile" 
            element={<ProtectedRoute element={<ProfilePage />} />} 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;