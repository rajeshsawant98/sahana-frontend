import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  return (
    <button onClick={handleLogout} style={{ margin: '10px', padding: '10px' }}>
      Logout
    </button>
  );
};

export default LogoutButton;