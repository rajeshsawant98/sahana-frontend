import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../apis/authAPI";
import {
  Box,
  Container,
  Snackbar,
  Typography,
  Chip,
} from "@mui/material";
import { PersonRounded, CalendarToday } from "@mui/icons-material";
import { NavBar } from "../components/navigation";
import { login } from "../redux/slices/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import { User } from "../types/User";
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

  const handleEditToggle = (): void => {
    setIsEditing(!isEditing);
  };

  const greeting = useMemo((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const memberSince = useMemo(() => {
    if (!profile.created_at) return null;
    return new Date(profile.created_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [profile.created_at]);

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: "100vh" }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 191, 73, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFBF49',
                }}
              >
                <PersonRounded sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  {greeting}, {profile.name?.split(' ')[0] || "there"}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                  {memberSince && (
                    <Chip
                      icon={<CalendarToday sx={{ fontSize: 12 }} />}
                      label={`Member since ${memberSince}`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(76, 175, 80, 0.12)',
                        color: '#4CAF50',
                        '& .MuiChip-icon': { color: '#4CAF50' },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Profile Card */}
          <Box
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: '20px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'divider',
              boxShadow: (theme) => theme.palette.mode === 'light'
                ? '0 8px 40px rgba(0,0,0,0.09)'
                : 'none',
            }}
          >
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
          </Box>
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
