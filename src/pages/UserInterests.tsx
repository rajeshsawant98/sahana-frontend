import React, { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NavBar } from "../components/navigation";
import { updateUserInterests } from "../apis/authAPI";
import { RootState, AppDispatch } from "../redux/store";
import { login } from "../redux/slices/authSlice";

// ...existing code...

const UserInterests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [interests, setInterests] = useState<string[]>([]);
  // Popular categories and interests for a meetup app
  const popularCategories: { label: string; emoji?: string; interests: string[] }[] = [
    {
      label: "Popular",
      emoji: "🔥",
      interests: [
        "Tech Meetups", "Startup Events", "Outdoor Adventures", "Fitness", "Foodies",
        "Live Music", "Book Clubs", "Board Games", "Volunteering", "Networking"
      ]
    },
    {
      label: "Tech & Startups",
      emoji: "💻",
      interests: [
        "Web Development", "AI & Machine Learning", "Product Management", "Hackathons", "Crypto & Blockchain"
      ]
    },
    {
      label: "Outdoors & Fitness",
      emoji: "🏞️",
      interests: [
        "Hiking", "Cycling", "Running", "Yoga", "Climbing", "Camping"
      ]
    },
    {
      label: "Learning & Hobbies",
      emoji: "📚",
      interests: [
        "Photography", "Cooking", "Art & Drawing", "Language Exchange", "Writing", "Gardening"
      ]
    },
    {
      label: "Social & Fun",
      emoji: "🎉",
      interests: [
        "Nightlife", "Karaoke", "Dancing", "Trivia Nights", "Movie Nights", "Pet Lovers"
      ]
    },
    {
      label: "Games & Esports",
      emoji: "🎮",
      interests: [
        "Board Games", "Chess", "D&D", "Esports", "Card Games"
      ]
    },
    {
      label: "Wellness",
      emoji: "🧘",
      interests: [
        "Meditation", "Mental Health", "Wellness Retreats", "Healthy Living"
      ]
    }
  ];
  const [loading, setLoading] = useState<boolean>(false);

  // Load existing interests on mount
  useEffect(() => {
    if (user?.interests) {
      setInterests(user.interests);
    }
  }, [user]);

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSavePreferences = async (): Promise<void> => {
    if (interests.length < 1) {
      alert("Please select at least one interest.");
      return;
    }
    if (!accessToken || !user) {
      alert("User not authenticated");
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
      alert("Interests updated successfully!");
    } catch (error) {
      alert("Error saving interests");
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: '100vh',
          background: theme => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 60% 40%, #232526 0%, #181a1b 100%)'
            : 'radial-gradient(circle at 60% 40%, #f6f7f8 0%, #e3e6ea 100%)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1000,
            background: theme => theme.palette.mode === 'dark' ? '#232526' : '#fff',
            borderRadius: '28px',
            boxShadow: theme => theme.palette.mode === 'dark' ? '0 6px 32px rgba(0,0,0,0.45)' : '0 6px 32px rgba(0,0,0,0.10)',
            p: { xs: 2.5, sm: 5 },
            mt: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 0.5, letterSpacing: '-0.5px', fontFamily: 'inherit', color: 'primary.main', fontSize: { xs: 24, sm: 32 } }}>
            Interests
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary', fontSize: 16, fontWeight: 400 }}>
            Select your interests to get better event suggestions and connect with like-minded people.
          </Typography>


          {/* User Interests Section - Card style */}
          <Box sx={{
            width: '100%',
            mb: 3,
            background: theme => theme.palette.mode === 'dark' ? '#232526' : '#f8fafd',
            borderRadius: '18px',
            boxShadow: theme => theme.palette.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.18)' : '0 2px 12px rgba(0,0,0,0.06)',
            p: { xs: 2, sm: 3 },
            border: theme => theme.palette.mode === 'dark' ? '1px solid #23272e' : '1px solid #e3e6ea',
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: 'primary.main', fontSize: 16 }}>
              Your Interests
            </Typography>
            <Box sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              mb: 1.5,
              minHeight: 40,
            }}>
              {interests.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                  Add or select interests below
                </Typography>
              )}
              {interests.map((interest, idx) => (
                <Box
                  key={interest}
                  component="span"
                  title="Remove from your interests"
                  onClick={() => setInterests(interests.filter(i => i !== interest))}
                  sx={theme => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme.palette.primary.main,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    borderRadius: '8px',
                    height: 36,
                    minWidth: 120,
                    maxWidth: 180,
                    px: 2,
                    fontSize: 15,
                    fontWeight: 500,
                    marginRight: '8px',
                    marginBottom: '8px',
                    border: `1.5px solid ${theme.palette.primary.main}`,
                    boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      background: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      border: `1.5px solid ${theme.palette.primary.dark}`,
                    },
                  })}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{interest}</span>
                  <span style={{ marginLeft: 6, fontSize: 16, fontWeight: 700, pointerEvents: 'none' }}>×</span>
                </Box>
              ))}
              {/* Inline custom input for adding interests */}
              <input
                type="text"
                placeholder="Add a custom interest"
                style={{
                  minWidth: 160,
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 15,
                  padding: '6px 8px',
                  color: 'inherit',
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const val = e.currentTarget.value.trim();
                    if (!interests.includes(val)) {
                      setInterests([...interests, val]);
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>
                  Click a chip to remove it from your interests.
                </Typography>
            </Box>

          {/* Popular Categories in single column */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, fontWeight: 400 }}>
              Click a chip to add it to your interests.
            </Typography>
            {popularCategories.map((cat, idx) => (
              <Box key={cat.label} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, color: 'primary.main', fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: 18, marginRight: 6 }}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {cat.interests.filter(interest => !interests.includes(interest)).map(interest => (
                    <Box
                      key={interest}
                      component="button"
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      title="Add to your interests"
                      sx={theme => ({
                        marginBottom: 1,
                        cursor: 'pointer',
                        outline: 'none',
                        border: `1.5px solid ${theme.palette.primary.main}`,
                        background: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderRadius: '8px',
                        padding: '6px 16px',
                        fontSize: 15,
                        fontWeight: 500,
                        marginRight: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        userSelect: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        transition: 'background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s',
                        '&:hover': {
                          background: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          border: `1.5px solid ${theme.palette.primary.dark}`,
                          boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
                        },
                      })}
                    >
                      <span>{interest}</span>
                      <span style={{ marginLeft: 6, fontSize: 16, fontWeight: 700, pointerEvents: 'none' }}>+</span>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePreferences}
            sx={{ mt: 1.5, width: '100%', fontWeight: 600, fontSize: 15, borderRadius: '9px', py: 1.1 }}
            disabled={loading || interests.length === 0}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : interests.length === 0 ? 'Select at least 1 to continue' : 'Save Interests'}
          </Button>
        </Box>
        {/* Styles moved to sx props using theme colors */}
      </Box>
    </>
  );
};

export default UserInterests;
