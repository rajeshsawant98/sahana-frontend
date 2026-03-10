import React, { useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { createAppTheme } from "./styles/theme/theme";
import InitRedux from "./utils/InitRedux";
import AuthBootstrap from "./utils/AuthBootstrap";
import { CacheStatus } from "./components/ui";
import { AppRoutes } from "./routes";

const App = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  
  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
            <InitRedux />
            <AuthBootstrap />
            <AppRoutes />
            {/* Development-only cache status component */}
            {import.meta.env.DEV && <CacheStatus />}
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
