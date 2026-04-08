import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner center size="lg" />;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    if (user.role === 'donor') return <Navigate to="/donor-dashboard" replace />;
    if (user.role === 'ngo') return <Navigate to="/ngo-dashboard" replace />;
    if (user.role === 'volunteer') return <Navigate to="/volunteer-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
