import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const [location, setLocation] = useState(null);
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error(error)
      );
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        center={location || { lat: 0, lng: 0 }}
        zoom={10}
        mapContainerStyle={{ height: '400px', width: '100%' }}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;