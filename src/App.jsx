import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LandingPage from "./pages/LandingPage"; // Import LandingPage component
import LoginPage from "./pages/LoginPage"; // Import the combined LoginPage component
import SignUpComponent from "./components/SignUpComponent"; // Import your SignUp component
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import UserInterests from "./pages/UserInterests";
import Events from "./pages/Events";
import { LoadScript } from "@react-google-maps/api";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import InitRedux from "./utils/InitRedux";
import AuthBootstrap from "./utils/AuthBootstrap";
import NearbyEventsPage from "./pages/NearbyEventsPage";


const App = () => {

  return (
    <GoogleOAuthProvider clientId="856426602401-1745mq5b7mhp9norpftmi77sv515jfbh.apps.googleusercontent.com">
      <Router>
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <InitRedux />
          <AuthBootstrap />
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
              path="/interests"
              element={<ProtectedRoute element={<UserInterests />} />}
            />
            <Route
              path="/nearby-events"
              element={<ProtectedRoute element={<NearbyEventsPage />} />}
            />
            <Route
              path="/events"
              element={<ProtectedRoute element={<Events />} />}
            />
            <Route
              path="/events/:id"
              element={<ProtectedRoute element={<EventDetails />} />}
            />
            <Route
              path="/events/new"
              element={<ProtectedRoute element={<CreateEvent />} />}
            />
            <Route
              path="/events/my"
              element={<ProtectedRoute element={<MyEvents />} />}
            />
          </Routes>
        </LoadScript>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
