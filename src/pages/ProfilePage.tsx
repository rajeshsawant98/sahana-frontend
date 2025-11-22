import React, { useEffect, useState } from "react";
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
