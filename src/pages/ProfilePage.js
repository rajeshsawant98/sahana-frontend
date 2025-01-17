import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import LogoutButton from '../components/buttons/LogoutButton';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: '',
  });
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch profile data on component mount
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        const { name, email, profile_picture } = response.data;
        setProfile({ name, email, profilePicture: profile_picture });
        setName(name); // Pre-fill name for editing
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put('/auth/me', { name });
      setSuccess('Profile updated successfully');
      setProfile((prev) => ({ ...prev, name }));
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <img
          src={profile.profilePicture || 'https://via.placeholder.com/150'}
          alt="Profile"
          width={150}
        />
      </div>
      <form onSubmit={handleUpdateProfile}>
        <label>
          Update Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      <LogoutButton />
    </div>
  );
};

export default ProfilePage;