import React, { useEffect, useState } from 'react';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LocationState {
  city: string;
  state: string;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  address_components: AddressComponent[];
}

interface GeocodeResponse {
  results: GeocodeResult[];
}

const LocationNavbar: React.FC = () => {
  const [location, setLocation] = useState<LocationState>({ city: '', state: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;

          fetch(geocodeUrl)
            .then((response) => response.json())
            .then((data: GeocodeResponse) => {
              if (data.results && data.results.length > 0) {
                const components = data.results[0].address_components;

                const city = components.find((c) => c.types.includes("locality"))?.long_name || "Unknown city";
                const state = components.find((c) => c.types.includes("administrative_area_level_1"))?.short_name || "Unknown";

                setLocation({ city, state });
              } else {
                setError('Unable to retrieve location name.');
              }
              setLoading(false);
            })
            .catch(() => {
              setError('Error fetching location data.');
              setLoading(false);
            });
        },
        () => {
          setError('Unable to retrieve your location. Please allow location access.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const handleLocationClick = (): void => {
    navigate('/nearby-events', { 
      state: { 
        city: location.city, 
        state: location.state 
      } 
    });
  };

  return (
    <div className="navbar-location">
      {loading ? (
        <CircularProgress color="primary" />
      ) : error ? (
        <span>{error}</span>
      ) : location.city && location.state ? (
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
            onClick={handleLocationClick}
          >
            {location.city}
          </Button>
        </span>
      ) : null}
    </div>
  );
};

export default LocationNavbar;
