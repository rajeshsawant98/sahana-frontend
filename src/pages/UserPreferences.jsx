import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import NavBar from '../components/NavBar';

const categories = {
  'Hobbies & Interests': [
    { name: 'Shopping', img: '/assets/categories/Shopping.svg' },
    { name: 'Food', img: '/assets/categories/Food.svg' },
    { name: 'Travel', img: '/assets/categories/Travel.svg' },
    { name: 'Technology', img: '/assets/categories/Technology.svg' },
  ],
  'Art & Culture': [
    { name: 'Music', img: '/assets/categories/Music.svg' },
    { name: 'Art', img: '/assets/categories/Art.svg' },
    { name: 'Literature', img: '/assets/categories/Literature.svg' },
    { name: 'History', img: '/assets/categories/History.svg' },
  ],
  'Sports & Recreation': [
    { name: 'Sports', img: '/assets/categories/Sports.svg' },
    { name: 'Fitness', img: '/assets/categories/Fitness.svg' },
    { name: 'Outdoors', img: '/assets/categories/Outdoors.svg' },
    { name: 'Gaming', img: '/assets/categories/Gaming.svg' },
  ],
};

const UserPreferences = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (subcategory) => {
    if (selectedCategories.includes(subcategory)) {
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat !== subcategory)
      );
    } else if (selectedCategories.length < 5) {
      setSelectedCategories((prev) => [...prev, subcategory]);
    }
  };

  const handleSavePreferences = () => {
    if (selectedCategories.length < 3) {
      alert('Please select at least 3 subcategories.');
      return;
    }
    // TODO: Implement API call to save preferences
    console.log('Saved Preferences:', selectedCategories);
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
        {/* <Typography variant="body1" color="textSecondary">
          Choose between 3 to 5 subcategories that interest you.
        </Typography> */}

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
                //justifyContent: 'center', 
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

        {/* Display Selected Categories
        <Typography variant="body2" color="textSecondary">
          Selected Subcategories: {selectedCategories.join(', ')}
        </Typography> */}

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePreferences}
          sx={{
            marginTop: 2,
          }}
        >
          Save Preferences
        </Button>
      </Box>
    </>
  );
};

export default UserPreferences;