import React from 'react';
import { useAuth } from './AuthProvider';

export const AuthButton = () => {
  const { user, isLoading, login, logout } = useAuth();

  const handleLogin = () => {
    login(window.location.href);
  };

  const handleLogout = () => {
    sessionStorage.setItem('post_logout_return_url', window.location.href);
    logout();
  };

  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  if (user) {
    return <button onClick={handleLogout}>Logout</button>;
  }

  return <button onClick={handleLogin}>Login</button>;
};
