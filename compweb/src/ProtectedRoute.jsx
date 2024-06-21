// ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Optionally, you can store the referer in localStorage or sessionStorage
    localStorage.setItem('referer', location.pathname);
  }, [location.pathname]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Element />;
};

export default ProtectedRoute;
