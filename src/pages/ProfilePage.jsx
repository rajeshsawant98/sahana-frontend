import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import LogoutButton from "../components/buttons/LogoutButton";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid2,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { Autocomplete } from "@react-google-maps/api";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [location, setLocation] = useState({});
  const [locationInput, setLocationInput] = useState(""); // Store manual location input
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        console.log(data);
        setProfile(data);
        setFormData(data);
        setLocation(data.location || {});
        setLocationInput(data.location ? `${data.location.city}, ${data.location.country}` : "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationInputChange = (e) => {
    setLocationInput(e.target.value); // Allow manual input of the location
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/auth/me", { ...formData, location });
      console.log(formData);
      console.log(location);
      setProfile(formData);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const city = place.address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        const country = place.address_components.find((comp) =>
          comp.types.includes("country")
        )?.long_name;

        setLocation({
          latitude: lat,
          longitude: lng,
          city: city || "",
          country: country || "",
        });
        setLocationInput(`${city || ""}, ${country || ""}`); // Update input field with selected location
      }
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: "#f3f2ef", minHeight: "100vh", padding: 3 }}>
        <Container>
          <Grid2 container spacing={3}>
            <Grid2 item size={3} md={3}>
              <Card>
                <CardContent>
                  <Avatar
                    src={profile.profile_picture || "https://dummyimage.com/150x150/cccccc/ffffff&text=Profile"}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Typography variant="h5">{profile.name || "Your Name"}</Typography>
                  <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 item size={9} md={9}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Edit Profile</Typography>
                  <form onSubmit={handleUpdateProfile}>
                    <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Bio"
                      name="bio"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Interests"
                      name="interests"
                      fullWidth
                      value={formData.interests || ""}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Profession"
                      name="profession"
                      fullWidth
                      value={formData.profession || ""}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Birthday"
                      name="birthdate"
                      fullWidth
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.birthdate || ""}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      fullWidth
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />

                    {/* Location Input with Autocomplete */}
                    <Autocomplete
                      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <TextField
                        label="Location"
                        fullWidth
                        placeholder="Enter your location"
                        value={locationInput}  // Use locationInput for manual typing
                        onChange={handleLocationInputChange}  // Allow manual input change
                        sx={{ mb: 2 }}
                      />
                    </Autocomplete>

                    <Button variant="contained" color="primary" type="submit" fullWidth>
                      Save Changes
                    </Button>
                  </form>
                  <Box mt={2}>
                    <LogoutButton />
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Container>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
</>
  );
};

export default ProfilePage;