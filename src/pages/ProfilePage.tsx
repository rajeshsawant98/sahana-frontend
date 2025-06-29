import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { updateUserProfile } from "../apis/authAPI";
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
import { Edit as EditIcon } from "@mui/icons-material";
import { NavBar } from "../components/navigation";
import { Autocomplete } from "@react-google-maps/api";
import { login } from "../redux/slices/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import { User, LocationData } from "../types/User";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const { user: cachedProfile, accessToken } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<Partial<User>>({});
  const [formData, setFormData] = useState<Partial<User>>({});
  const [location, setLocation] = useState<Partial<LocationData>>({});
  const [locationInput, setLocationInput] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
    if (name === 'interests') {
      // Handle interests as comma-separated string that gets converted to array
      setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const handleEditToggle = (): void => {
    setIsEditing(!isEditing);
  };

  const getTimeBasedGreeting = (): string => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  // Helper function for consistent field label styling
  const getFieldLabelStyle = () => ({
    mb: 1,
    color: darkMode ? '#b0b0b0' : '#666666',
    fontSize: '14px',
    fontWeight: 500
  });

  // Helper function for consistent text field styling
  const getTextFieldStyle = () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#333333',
      '& fieldset': {
        borderColor: darkMode ? '#444444' : '#ddd'
      },
      '&:hover fieldset': {
        borderColor: darkMode ? '#666666' : '#bbb'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2'
      }
    },
    '& .MuiInputLabel-root': {
      color: darkMode ? '#b0b0b0' : '#666666'
    }
  });

  // Helper function for consistent text display styling
  const getTextDisplayStyle = () => ({
    color: darkMode ? '#ffffff' : '#333333',
    py: 0.5,
    fontSize: '16px'
  });

  return (
    <>
      <NavBar />
      <Box sx={{ 
        backgroundColor: darkMode ? '#121212' : '#ffffff', 
        minHeight: "100vh", 
        padding: 0 
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            px: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 600, 
                color: darkMode ? '#ffffff' : '#333333',
                mb: 0.5 
              }}>
                {getTimeBasedGreeting()}, {profile.name || "User"}!
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#b0b0b0' : '#666666',
                fontSize: '14px'
              }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>

          {/* Main Profile Card */}
          <Card sx={{ 
            borderRadius: '12px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
            border: darkMode ? '1px solid #333333' : '1px solid #e0e0e0',
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff'
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Profile Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 4,
                pb: 3,
                borderBottom: darkMode ? '1px solid #333333' : '1px solid #e0e0e0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={profile.profile_picture || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"}
                    sx={{ 
                      width: 72, 
                      height: 72, 
                      mr: 3
                    }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 600, 
                      color: darkMode ? '#ffffff' : '#333333',
                      mb: 0.5 
                    }}>
                      {profile.name || "Not provided"}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: darkMode ? '#b0b0b0' : '#666666',
                      fontSize: '14px'
                    }}>
                      {profile.email || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
                {!isEditing && (
                  <Button
                    variant="contained"
                    onClick={handleEditToggle}
                    startIcon={<EditIcon />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              {/* Form Section */}
              <form onSubmit={handleUpdateProfile}>
                <Grid2 container spacing={4}>
                  {/* Left Column */}
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Full Name
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="name"
                          fullWidth
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          sx={getTextFieldStyle()}
                        />
                      ) : (
                        <Typography variant="body1" sx={getTextDisplayStyle()}>
                          {profile.name || "Not provided"}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Birthday
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="birthdate"
                          fullWidth
                          value={formData.birthdate || ""}
                          onChange={handleInputChange}
                          type="date"
                          variant="outlined"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          sx={getTextFieldStyle()}
                        />
                      ) : (
                        <Typography variant="body1" sx={getTextDisplayStyle()}>
                          {profile.birthdate || "Not provided"}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Bio
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="bio"
                          fullWidth
                          value={formData.bio || ""}
                          onChange={handleInputChange}
                          multiline
                          rows={3}
                          variant="outlined"
                          size="small"
                          sx={getTextFieldStyle()}
                        />
                      ) : (
                        <Typography variant="body1" sx={{ 
                          ...getTextDisplayStyle(),
                          lineHeight: 1.5
                        }}>
                          {profile.bio || "No bio provided"}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Profession
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="profession"
                          fullWidth
                          value={formData.profession || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          sx={getTextFieldStyle()}
                        />
                      ) : (
                        <Typography variant="body1" sx={getTextDisplayStyle()}>
                          {profile.profession || "Not specified"}
                        </Typography>
                      )}
                    </Box>
                  </Grid2>

                  {/* Right Column */}
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Interests
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="interests"
                          fullWidth
                          value={Array.isArray(formData.interests) ? formData.interests.join(', ') : (formData.interests || "")}
                          onChange={handleInputChange}
                          placeholder="Enter interests separated by commas"
                          variant="outlined"
                          size="small"
                          sx={getTextFieldStyle()}
                        />
                      ) : (
                        <Typography variant="body1" sx={getTextDisplayStyle()}>
                          {Array.isArray(profile.interests) && profile.interests.length > 0 
                            ? profile.interests.join(', ') 
                            : "No interests listed"}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Phone Number
                      </Typography>
                      {isEditing ? (
                        <TextField
                          name="phoneNumber"
                          fullWidth
                          value={formData.phoneNumber || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          sx={getTextFieldStyle()}
                        />
                      ) : (
                        <Typography variant="body1" sx={getTextDisplayStyle()}>
                          {profile.phoneNumber || "Not provided"}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={getFieldLabelStyle()}>
                        Location
                      </Typography>
                      {isEditing ? (
                        <Autocomplete
                          onLoad={(autocomplete) =>
                            (autocompleteRef.current = autocomplete)
                          }
                          onPlaceChanged={handlePlaceChanged}
                        >
                          <TextField
                            fullWidth
                            placeholder="Enter your location"
                            value={locationInput}
                            onChange={handleLocationInputChange}
                            variant="outlined"
                            size="small"
                            sx={getTextFieldStyle()}
                          />
                        </Autocomplete>
                      ) : (
                        <Typography variant="body1" sx={getTextDisplayStyle()}>
                          {profile.location?.city && profile.location?.country 
                            ? `${profile.location.city}, ${profile.location.country}` 
                            : 'Not provided'}
                        </Typography>
                      )}
                    </Box>
                  </Grid2>
                </Grid2>

                {isEditing && (
                  <Box sx={{ 
                    mt: 4, 
                    display: 'flex', 
                    gap: 2, 
                    justifyContent: 'flex-end' 
                  }}>
                    <Button
                      variant="outlined"
                      onClick={handleEditToggle}
                      sx={{ 
                        borderRadius: '8px', 
                        textTransform: 'none', 
                        px: 3,
                        py: 1,
                        fontSize: '14px'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ 
                        borderRadius: '8px', 
                        textTransform: 'none', 
                        px: 3,
                        py: 1,
                        fontSize: '14px'
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </form>

              {!isEditing && (
                <Box sx={{ 
                  mt: 4, 
                  pt: 3,
                  borderTop: darkMode ? '1px solid #333333' : '1px solid #e0e0e0',
                  display: 'flex', 
                  justifyContent: 'center' 
                }}>

                </Box>
              )}
            </CardContent>
          </Card>
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
