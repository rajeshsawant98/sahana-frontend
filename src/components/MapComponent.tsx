import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

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
