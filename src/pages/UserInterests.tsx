import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
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
  // Popular categories and interests for a meetup app
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');

  // Load existing interests on mount
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
      setDialogMsg('Please select at least one interest.');
      setDialogOpen(true);
      return;
    }
    if (!accessToken || !user) {
      setDialogMsg('User not authenticated');
      setDialogOpen(true);
      return;
    }
    setLoading(true);
    try {
      await updateUserInterests({ interests });
      dispatch(
        login({
          user: {
            ...user,
            interests,
          },
          accessToken,
          role: user.role,
        })
      );
      setDialogMsg('Interests updated successfully!');
      setDialogOpen(true);
    } catch (error) {
      setDialogMsg('Error saving interests');
      setDialogOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 60% 40%, #232526 0%, #181a1b 100%)'
              : 'radial-gradient(circle at 60% 40%, #f6f7f8 0%, #e3e6ea 100%)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1000,
            background: (theme) =>
              theme.palette.mode === 'dark' ? '#232526' : '#fff',
            borderRadius: '28px',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 6px 32px rgba(0,0,0,0.45)'
                : '0 6px 32px rgba(0,0,0,0.10)',
            p: { xs: 2.5, sm: 5 },
            mt: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography
              variant='h4'
              fontWeight={700}
              sx={{
                letterSpacing: '-0.5px',
                fontFamily: 'inherit',
                color: 'primary.main',
                fontSize: { xs: 24, sm: 32 },
              }}
            >
              Interests
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSavePreferences}
              sx={{
                fontWeight: 600,
                fontSize: 15,
                borderRadius: '9px',
                py: 1.1,
                minWidth: 160,
                ml: 2,
              }}
              disabled={loading || interests.length === 0}
            >
              {loading ? (
                <CircularProgress size={22} color='inherit' />
              ) : interests.length === 0 ? (
                'Select at least 1 to continue'
              ) : (
                'Save Interests'
              )}
            </Button>
          </Box>
          <Typography
            variant='body1'
            sx={{
              mb: 3,
              color: 'text.secondary',
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Select your interests to get better event suggestions and connect
            with like-minded people.
          </Typography>

          {/* User Interests Section - Card style */}
          <Box
            sx={{
              width: '100%',
              mb: 3,
              background: (theme) =>
                theme.palette.mode === 'dark' ? '#232526' : '#f8fafd',
              borderRadius: '18px',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 2px 12px rgba(0,0,0,0.18)'
                  : '0 2px 12px rgba(0,0,0,0.06)',
              p: { xs: 2, sm: 3 },
              border: (theme) =>
                theme.palette.mode === 'dark'
                  ? '1px solid #23272e'
                  : '1px solid #e3e6ea',
              minHeight: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              variant='subtitle1'
              fontWeight={600}
              sx={{ mb: 1, color: 'primary.main', fontSize: 16 }}
            >
              Your Interests
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
                mb: 1.5,
                minHeight: 40,
              }}
            >
              {interests.length === 0 && (
                <Typography
                  variant='body2'
                  sx={{ color: 'text.secondary', fontWeight: 400 }}
                >
                  Add or select interests below
                </Typography>
              )}
              {interests.map((interest, idx) => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected
                  onClick={() =>
                    setInterests(interests.filter((i) => i !== interest))
                  }
                  actionIcon='×'
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

          {/* Popular Categories in single column */}
          <Box sx={{ width: '100%', mb: 2 }}>
            {popularCategories.map((cat: PopularCategory) => (
              <CategorySection
                key={cat.label}
                category={cat}
                selectedInterests={interests}
                onSelect={handleToggleInterest}
              />
            ))}
          </Box>

          {/* Save button moved to header */}
        </Box>
        {/* Styles moved to sx props using theme colors */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Update Interests</DialogTitle>
          <DialogContent>
            <Typography>{dialogMsg}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default UserInterests;
