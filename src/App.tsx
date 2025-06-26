import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { createAppTheme } from "./styles/theme/theme";
import LandingPage from "./pages/LandingPage"; // Import LandingPage component
import LoginPage from "./pages/LoginPage"; // Import the combined LoginPage component
import SignUpComponent from "./components/SignUpComponent"; // Import your SignUp component
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import UserInterests from "./pages/UserInterests";
import Events from "./pages/Events";
import EditEvent from "./pages/EditEvent"; // Import EditEvent component
import { LoadScript } from "@react-google-maps/api";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import InitRedux from "./utils/InitRedux";
import AuthBootstrap from "./utils/AuthBootstrap";
import NearbyEventsPage from "./pages/NearbyEventsPage";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageEvents from "./pages/admin/ManageEvents";

const App = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  
  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpComponent />} />
              <Route path="/nearby-events" element={<NearbyEventsPage />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* Admin Routes */}

              <Route
                path="/admin"
                element={<AdminRoute element={<AdminDashboard />} />}
              />
              <Route
                path="/admin/users"
                element={<AdminRoute element={<ManageUsers />} />}
              />
              <Route
                path="/admin/events"
                element={<AdminRoute element={<ManageEvents />} />}
              />

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
                path="/events"
                element={<ProtectedRoute element={<Events />} />}
              />
              <Route
                path="/events/:id/edit"
                element={<ProtectedRoute element={<EditEvent />} />}
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
    </ThemeProvider>
  );
};

export default App;
