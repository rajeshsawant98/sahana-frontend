import React from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NavBar } from "../components/navigation";
import { AnimateSVG } from "../components/ui";
import groupDiscussionSVG from "../assets/group-discussion.svg?raw";
import "../styles/vendor/group-discussion-styles.css";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/events' : '/login');
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          minHeight: "calc(100dvh - 56px)",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "stretch",
          py: { xs: 2.5, md: 0 },
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 5, md: 8, lg: 10 } }}>
          <Box
            sx={{
              display: "grid",
              minHeight: "calc(100dvh - 56px)",
              gridTemplateColumns: { xs: "1fr", md: "minmax(420px, 0.95fr) minmax(620px, 1.25fr)" },
              alignItems: "center",
              gap: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                maxWidth: { xs: "100%", md: 620 },
                mx: { xs: 0, md: 0 },
                pl: { md: 2 },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: "100px",
                  backgroundColor: darkMode
                    ? "rgba(255,191,73,0.1)"
                    : "rgba(255,191,73,0.12)",
                  border: "1px solid rgba(255,191,73,0.25)",
                  mb: { xs: 2.5, md: 3 },
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#FFBF49",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: "#FFBF49",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                  }}
                >
                  events near you
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  background: "linear-gradient(135deg, #FFBF49 0%, #FF8C00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 900,
                  fontSize: { xs: "4.4rem", sm: "5.8rem", md: "8.2rem", lg: "9.4rem" },
                  lineHeight: 0.92,
                  letterSpacing: { xs: "-2px", md: "-4px" },
                  mb: { xs: 2.5, md: 3.5 },
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                sahana
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: "1.05rem", md: "1.35rem" },
                  lineHeight: 1.7,
                  mb: { xs: 3.5, md: 5 },
                  maxWidth: 500,
                }}
              >
                Discover local events, connect with friends, and make memories.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  alignSelf: "flex-start",
                  px: 4.5,
                  py: 1.65,
                  borderRadius: "100px",
                  fontSize: "1.08rem",
                  fontWeight: 700,
                  height: "auto",
                  background: "linear-gradient(135deg, #FFBF49 0%, #FF8C00 100%)",
                  color: "#000",
                  boxShadow: "0 4px 24px rgba(255,191,73,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #FFD07A 0%, #FFBF49 100%)",
                    boxShadow: "0 6px 32px rgba(255,191,73,0.5)",
                  },
                }}
              >
                {isAuthenticated ? "Explore Events →" : "Get Started →"}
              </Button>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                mt: { xs: 1.5, md: 0 },
              }}
            >
              <AnimateSVG
                svgMarkup={groupDiscussionSVG}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "1100px",
                  height: "auto",
                  maxHeight: "84dvh",
                  opacity: darkMode ? 0.75 : 0.95,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
