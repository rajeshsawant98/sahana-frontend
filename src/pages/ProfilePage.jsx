import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import LogoutButton from "../components/buttons/LogoutButton";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Fetch profile data on component mount
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        const { name, email, profile_picture } = response.data;
        setProfile({ name, email, profilePicture: profile_picture });
        setName(name); // Pre-fill name for editing
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put("/auth/me", { name });
      setProfile((prev) => ({ ...prev, name }));
      setSuccess("Profile updated successfully");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError("");
    setSuccess("");
  };

  return (
    <>
    <NavBar />
    <Box
      sx={{
        backgroundColor: "#f3f2ef",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #0073b1, #004182)",
          height: "180px",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {/* Profile Avatar and Details on the Left */}
        <Container
          sx={{
            position: "absolute",
            top: 50,
            left: 30,
            display: "flex",
            alignItems: "center",  // Align items vertically
            color: "white",
          }}
        >
          <Avatar
            src={
              profile.profilePicture ||
              "https://dummyimage.com/150x150/cccccc/ffffff&text=Profile"
            }
            alt="Profile"
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              marginRight: "20px",  // Space between the picture and text
            }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {profile.name || "Your Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ marginTop: "5rem" }}>
        <Grid container spacing={3}>
          {/* Left Section: Profile Information */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  About
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add a short description about yourself here, like your role,
                  interests, or goals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Section: Edit Profile Form */}
          <Grid item xs={12} md={9}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Edit Profile
                </Typography>
                <form onSubmit={handleUpdateProfile} style={{ marginTop: "1rem" }}>
                  <TextField
                    label="Update Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ marginBottom: "1rem" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </form>
                <Box mt={3}>
                  <LogoutButton />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={success || error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          style: { backgroundColor: success ? "green" : "red" },
        }}
      />
    </Box>
    </>
  );
};

export default ProfilePage;