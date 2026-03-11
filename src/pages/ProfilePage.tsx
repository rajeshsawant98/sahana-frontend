import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../apis/authAPI";
import {
  Box,
  Card,
  CardContent,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";
import { NavBar } from "../components/navigation";
import { login } from "../redux/slices/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import { User, Location } from "../types/User";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileForm } from "../components/profile/ProfileForm";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const { user: cachedProfile, accessToken } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<Partial<User>>({});
  const [message, setMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
    }
  }, [cachedProfile]);

  const handleUpdateProfile = async (updatedData: Partial<User>): Promise<void> => {
    try {
      // Merge updated data with existing profile
      const updatedProfile = { ...profile, ...updatedData };
      
      await updateUserProfile(updatedProfile);
      setProfile(updatedProfile);
      dispatch(login({ 
        user: updatedProfile as User, 
        accessToken: accessToken || '',
        role: updatedProfile.role || 'user' 
      }));
      setMessage("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleEditToggle = (): void => {
    setIsEditing(!isEditing);
  };

  const greeting = useMemo((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: "100vh", padding: 0 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.3px', mb: 0.5 }}>
              {greeting}, {profile.name || "User"}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>

          {/* Main Profile Card */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <ProfileHeader 
                profile={profile} 
                isEditing={isEditing} 
                onEditToggle={handleEditToggle} 
                darkMode={darkMode} 
              />
              
              <ProfileForm 
                profile={profile} 
                isEditing={isEditing} 
                darkMode={darkMode} 
                onCancel={handleEditToggle} 
                onSubmit={handleUpdateProfile} 
              />

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
