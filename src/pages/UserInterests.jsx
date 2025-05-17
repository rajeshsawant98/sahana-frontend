import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import NavBar from '../components/NavBar';
import axiosInstance from '../utils/axiosInstance';

// ⬇️ Dynamically load all SVGs from /assets/categories
const categoryIcons = {};
const images = require.context('../assets/categories', false, /\.svg$/);
images.keys().forEach((filename) => {
  const key = filename.replace('./', '').replace('.svg', '');
  categoryIcons[key] = images(filename);
});

// ⬇️ Categories defined by name only (SVGs matched by name)
const categories = {
  'Hobbies & Interests': ['Shopping', 'Food', 'Travel', 'Technology'],
  'Art & Culture': ['Music', 'Art', 'Literature', 'History'],
  'Sports & Recreation': ['Sports', 'Fitness', 'Outdoors', 'Gaming'],
};

const UserInterests = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const response = await axiosInstance.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const userInterests = response.data.interests;
        setSelectedCategories(userInterests);
      } catch (error) {
        console.error('Error fetching user interests:', error);
      }
    };
    fetchUserInterests();
  }, []);

  const handleCategoryClick = (subcategory) => {
    if (selectedCategories.includes(subcategory)) {
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat !== subcategory)
      );
    } else if (selectedCategories.length < 5) {
      setSelectedCategories((prev) => [...prev, subcategory]);
    }
  };

  const updateUserInterests = async (interests, email) => {
    try {
      const response = await axiosInstance.put('/auth/me/interests', { interests }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update interests: ' + error.message);
    }
  };

  const handleSavePreferences = async () => {
    if (selectedCategories.length < 3) {
      alert('Please select at least 3 subcategories.');
      return;
    }

    setLoading(true);
    try {
      await updateUserInterests(selectedCategories, email);
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Error saving preferences');
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
          gap: 3,
          marginTop: 4,
          paddingX: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Pick Your Interests!
        </Typography>

        {/* Render Main Categories with Subcategories */}
        {Object.entries(categories).map(([mainCategory, subcategoryList]) => (
          <Box key={mainCategory} sx={{ width: '100%', maxWidth: '850px' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
              {mainCategory}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                marginBottom: 3,
              }}
            >
              {subcategoryList.map((subcategoryName) => (
                <Box
                  key={subcategoryName}
                  onClick={() => handleCategoryClick(subcategoryName)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    width: '200px',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedCategories.includes(subcategoryName)
                      ? '4px solid #FFBF49'
                      : '2px solid #E0E0E0',
                    '&:hover': {
                      border: '4px solid #FFBF49',
                    },
                  }}
                >
                  <img
                    src={categoryIcons[subcategoryName]}
                    alt={subcategoryName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      padding: '4px 0',
                    }}
                  >
                    {subcategoryName}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePreferences}
          sx={{ marginTop: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Interests'}
        </Button>
      </Box>
    </>
  );
};

export default UserInterests;