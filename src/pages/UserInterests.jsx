import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import NavBar from '../components/NavBar';
import axiosInstance from '../utils/axiosInstance';

const categories = {
  'Hobbies & Interests': [
    { name: 'Shopping', img: '../assets/categories/Shopping.svg' },
    { name: 'Food', img: '../assets/categories/Food.svg' },
    { name: 'Travel', img: '../assets/categories/Travel.svg' },
    { name: 'Technology', img: '../assets/categories/Technology.svg' },
  ],
  'Art & Culture': [
    { name: 'Music', img: '../assets/categories/Music.svg' },
    { name: 'Art', img: '../assets/categories/Art.svg' },
    { name: 'Literature', img: '../assets/categories/Literature.svg' },
    { name: 'History', img: '../assets/categories/History.svg' },
  ],
  'Sports & Recreation': [
    { name: 'Sports', img: '../assets/categories/Sports.svg' },
    { name: 'Fitness', img: '../assets/categories/Fitness.svg' },
    { name: 'Outdoors', img: '../assets/categories/Outdoors.svg' },
    { name: 'Gaming', img: '../assets/categories/Gaming.svg' },
  ],
};

const UserInterests = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const email = localStorage.getItem('email');

  // Fetch the user's saved interests on component mount
  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const response = await axiosInstance.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const userInterests = response.data.interests;
        setSelectedCategories(userInterests); // Set the interests into the state
      } catch (error) {
        console.error('Error fetching user interests:', error);
      }
    };
    fetchUserInterests();
  }, []); // Empty dependency array to run only once when the component mounts

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
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you're using a token stored in localStorage
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

    setLoading(true); // Start loading

    try {
      await updateUserInterests(selectedCategories, email); // Send API request to save preferences
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Error saving preferences');
    } finally {
      setLoading(false); // Stop loading
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
        {Object.entries(categories).map(([mainCategory, subcategories]) => (
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
              {subcategories.map((subcategory) => (
                <Box
                  key={subcategory.name}
                  onClick={() => handleCategoryClick(subcategory.name)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    width: '200px',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedCategories.includes(subcategory.name)
                      ? '4px solid #FFBF49' // Highlight selected categories
                      : '2px solid #E0E0E0',
                    '&:hover': {
                      border: '4px solid #FFBF49', // Hover effect
                    },
                  }}
                >
                  <img
                    src={subcategory.img}
                    alt={subcategory.name}
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
                    {subcategory.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {/* Save Button with loading indicator */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePreferences}
          sx={{
            marginTop: 2,
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Interests'}
        </Button>
      </Box>
    </>
  );
};

export default UserInterests;