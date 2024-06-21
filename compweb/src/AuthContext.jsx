// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = () => {
    // Save referer before redirecting to login
    localStorage.setItem('referer', window.location.pathname);
    navigate('/login');
  };

  const logout = () => {
    // Clear referer on logout
    localStorage.removeItem('referer');
    // Perform logout actions, e.g., firebase auth signout
  };

  const handleLoginSuccess = () => {
    const referer = localStorage.getItem('referer') || '/';
    navigate(referer);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, handleLoginSuccess }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
