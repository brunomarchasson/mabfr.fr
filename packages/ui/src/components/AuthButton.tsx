import React from 'react';
import { useAuth } from './AuthProvider';

export const AuthButton = () => {
  const { session, isLoading, login, logout, register } = useAuth();

  const handleLogin = () => {
    login(window.location.href);
  };

  const handleLogout = () => {
    logout();
  };

  const handleRegister = () => {
    register(window.location.href);
  };

  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  if (session) {
    return <button onClick={handleLogout}>Logout</button>;
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};