import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../apis/authAPI";
import LogoutButton from "../components/buttons/LogoutButton";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Snackbar,
  TextField,
  Typography,
  Grid2
} from "@mui/material";
import NavBar from "../components/NavBar";
import { Autocomplete } from "@react-google-maps/api";
import { login } from "../redux/slices/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import { User, LocationData } from "../types/User";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: cachedProfile, accessToken } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<Partial<User>>({});
  const [formData, setFormData] = useState<Partial<User>>({});
  const [location, setLocation] = useState<Partial<LocationData>>({});
  const [locationInput, setLocationInput] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
      setFormData(cachedProfile);
      setLocation(cachedProfile.location || {});
      setLocationInput(
        cachedProfile.location
          ? `${cachedProfile.location.city}, ${cachedProfile.location.country}`
          : ""
      );
    }
  }, [cachedProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const updatedProfile = { ...formData, location: location as LocationData };
      await updateUserProfile(updatedProfile);
      setProfile(updatedProfile);
      dispatch(login({ 
        user: updatedProfile as User, 
        accessToken: accessToken || '',
        role: updatedProfile.role || 'user' 
      }));
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handlePlaceChanged = (): void => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        const state = place.address_components?.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.short_name;
        const formattedAddress = place.formatted_address;
        const name = place.name;
        const city = place.address_components?.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        const country = place.address_components?.find((comp) =>
          comp.types.includes("country")
        )?.long_name;

        if (lat !== undefined && lng !== undefined) {
          const newLocation: LocationData = {
            latitude: lat,
            longitude: lng,
            city: city || "",
            country: country || "",
            state: state || "",
            formattedAddress: formattedAddress || "",
            name: name,
          };

          setLocation(newLocation);
          setLocationInput(name || "");
        }
      }
    }
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocationInput(e.target.value);
  };

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: "#f3f2ef", minHeight: "100vh", padding: 3 }}>
        <Container>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    key={profile.profile_picture}
                    src={
                      profile.profile_picture ||
                      "https://dummyimage.com/150x150/cccccc/ffffff&text=Profile"
                    }
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h5">
                    {profile.name || "Your Name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 9 }}>
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

                    <Autocomplete
                      onLoad={(autocomplete) =>
                        (autocompleteRef.current = autocomplete)
                      }
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <TextField
                        label="Location"
                        fullWidth
                        placeholder="Enter your location"
                        value={locationInput}
                        onChange={handleLocationInputChange}
                        sx={{ mb: 2 }}
                      />
                    </Autocomplete>

                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
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
          onClose={handleCloseSnackbar}
          message={message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
    </>
  );
};

export default ProfilePage;
