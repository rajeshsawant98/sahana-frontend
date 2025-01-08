import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';  // Import HomePage component
import GoogleLoginComponent from './components/GoogleLoginComponent';  // Import your GoogleLogin component

const App = () => {
  return (
    <GoogleOAuthProvider clientId="505025857168-olhtcsvr2pmpu84k0gb25rkh61qksbm8.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<GoogleLoginComponent />} />  {/* Route for the login page */}
          <Route path="/home" element={<HomePage />} />  {/* Route for the home page */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;