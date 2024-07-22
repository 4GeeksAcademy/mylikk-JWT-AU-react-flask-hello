import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.BACKEND_URL+'/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('token', data.access_token);
        setMessage('Login successful! Welcome back.');
        setEmail('');
        setPassword('');
        navigate('/private')
      } else {
        setMessage(data.msg || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl mb-6 text-center">Login to Your Account</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      <p className="mt-4 text-center">
        Don't have an account? <a href="/signup" className="text-blue-500">Sign up here</a>
      </p>
    </div>
  );
};
