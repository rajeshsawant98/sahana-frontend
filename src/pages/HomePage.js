import React from 'react';
import LogoutButton from '../components/buttons/LogoutButton';


const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>This is where users will be redirected after a successful login.</p>
      <LogoutButton />
    </div>
  );
};

export default HomePage;