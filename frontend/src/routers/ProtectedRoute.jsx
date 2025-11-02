// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    // можно перенаправлять на страницу входа
    return <Navigate to="/login" replace />;
  }
  return <>{children ?? <Outlet />}</>;
}
