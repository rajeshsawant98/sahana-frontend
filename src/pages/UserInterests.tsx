import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
  Snackbar,
} from '@mui/material';
import { FavoriteRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { NavBar } from '../components/navigation';
import { updateUserInterests } from '../apis/authAPI';
import { RootState, AppDispatch } from '../redux/store';
import { login } from '../redux/slices/authSlice';
import {
  popularCategories,
  PopularCategory,
} from '../constants/popularCategories';
import InterestChip from '../components/interests/InterestChip';
import InterestInput from '../components/interests/InterestInput';
import CategorySection from '../components/interests/CategorySection';

const UserInterests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (user?.interests) {
      setInterests(user.interests);
    }
  }, [user]);

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSavePreferences = async (): Promise<void> => {
    if (interests.length < 1) {
      setSnackbarMsg('Please select at least one interest.');
      setSnackbarOpen(true);
      return;
    }
    if (!accessToken || !user) {
      setSnackbarMsg('User not authenticated');
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      await updateUserInterests({ interests });
      dispatch(
        login({
          user: { ...user, interests },
          accessToken,
          role: user.role,
        })
      );
      setSnackbarMsg('Interests updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMsg('Error saving interests. Please try again.');
      setSnackbarOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  <FavoriteRounded sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}
                  >
                    Interests
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select your interests to get better event suggestions and connect with like-minded people.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={handleSavePreferences}
                disabled={loading || interests.length === 0}
                sx={{ borderRadius: '100px', px: 3, height: 36, fontSize: '0.8rem', flexShrink: 0, mt: 0.5 }}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : interests.length === 0 ? (
                  'Select at least 1'
                ) : (
                  'Save Interests'
                )}
              </Button>
            </Box>
          </Box>

          {/* Your Interests Section */}
          <Box
            sx={{
              width: '100%',
              mb: 4,
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.9rem', color: 'text.primary' }}
            >
              Your Interests
              {interests.length > 0 && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 191, 73, 0.15)',
                    color: '#FFBF49',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {interests.length}
                </Box>
              )}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                alignItems: 'center',
                minHeight: 40,
              }}
            >
              {interests.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Add or select interests below to get started
                </Typography>
              )}
              {interests.map((interest) => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected
                  onClick={() => setInterests(interests.filter((i) => i !== interest))}
                  actionIcon="×"
                />
              ))}
              <InterestInput
                onAdd={(val) => {
                  if (val && !interests.includes(val)) {
                    setInterests([...interests, val]);
                  }
                }}
              />
            </Box>
          </Box>

          {/* Popular Categories */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}
            >
              Browse Popular Categories
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {popularCategories.map((cat: PopularCategory, index) => (
                <Box key={cat.label}>
                  <CategorySection
                    category={cat}
                    selectedInterests={interests}
                    onSelect={handleToggleInterest}
                  />
                  {index < popularCategories.length - 1 && (
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 1.5 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Snackbar replaces the modal Dialog for a less intrusive UX */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default UserInterests;
