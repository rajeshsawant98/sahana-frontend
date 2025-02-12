import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { GoogleMap, Marker } from '@react-google-maps/api';
import NavBar from '../components/NavBar';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Fetch event details from the backend
    axiosInstance.get(`/events/${id}`)
      .then(response => {
        setEvent(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the event details!", error);
      });
  }, [id]);

  if (!event) return <div>Loading...</div>;

  const { eventName, description, location, startTime, categories, isOnline, joinLink, imageURL } = event;
  const { latitude, longitude, formattedAddress,  name} = location;  // Destructure latitude and longitude

  return (
    <>
      <NavBar />
      <div className="event-details" style={{ padding: '20px' }}>
        {/* Event Image */}
        {imageURL && <img src={imageURL} alt={eventName} style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />}
        
        <h1>{eventName}</h1>
        <p>{description}</p>
        <p><strong>Location:</strong> {name}, {formattedAddress}</p> {/* Render city and country */}
        <p><strong>Start Time:</strong> {new Date(startTime).toLocaleString()}</p>
        <p><strong>Categories:</strong> {categories.join(", ")}</p>

        {isOnline ? (
          <p><strong>Online Event</strong> - <a href={joinLink} target="_blank" rel="noopener noreferrer">Join Now</a></p>
        ) : (
          <div style={{ height: '400px', width: '100%' }}>
            {/* Google Map displaying the event location */}
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={{ lat: latitude, lng: longitude }}  // Set map center to event location
              zoom={15}
            >
              {/* Marker placed at event location */}
              <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
          </div>
        )}

        <button onClick={() => alert("Join event functionality coming soon!")}>Join Event</button>
      </div>
    </>
  );
};

export default EventDetails;