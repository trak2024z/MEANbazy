import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
      {user ? (
        <>
          <h2>Hello, {user.username}!</h2>
          <button onClick={handleLogoutClick}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={handleLoginClick}>Go to Login</button>
          <button onClick={handleRegisterClick}>Go to Register</button>
        </>
      )}
    </div>
  );
};
export default Home;