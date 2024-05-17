import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importowanie useNavigate
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ isLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); // Inicjalizacja useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { username, password } : { username, password, email };
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      const { token, username: userName } = response.data;
      const user = { username: userName };
      login(user, token);
      alert(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
      navigate('/'); // Przekierowanie do strony głównej
    } catch (err) {
      setError(err.response ? err.response.data : 'Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {!isLogin && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      )}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default AuthForm;