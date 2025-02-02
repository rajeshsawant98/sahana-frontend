import React, { useEffect, useState } from 'react';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { Button, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const LocationNavbar = () => {
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;

          fetch(geocodeUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const city = data.results[0].address_components.find((component) =>
                  component.types.includes('locality')
                )?.long_name || 'Unknown location';
                setLocation(city);
              } else {
                setError('Unable to retrieve location name.');
              }
              setLoading(false); // Set loading to false once the location is fetched
            })
            .catch(() => {
              setError('Error fetching location data.');
              setLoading(false); // Set loading to false if there's an error
            });
        },
        () => {
          setError('Unable to retrieve your location. Please allow location access.');
          setLoading(false); // Set loading to false in case of an error
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false); // Set loading to false if geolocation is not supported
    }
  }, []);

  return (
    <div className="navbar-location">
      {loading ? (
         <CircularProgress color="primary" />
      ) : error ? (
        <span>{error}</span>
      ) : location ? (
        <span>
          <Button
            color="inherit"
            startIcon={<FmdGoodOutlinedIcon />}
            sx={{
              color: '#333333',
              fontWeight: '500',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#FFBF49',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => navigate('/events')}
          >
            {location}
          </Button>
        </span>
      ) : null}
    </div>
  );
};

export default LocationNavbar;