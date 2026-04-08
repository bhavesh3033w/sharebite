import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DonorDashboard from './pages/dashboards/donor/DonorDashboard';
import NgoDashboard from './pages/dashboards/ngo/NgoDashboard';
import VolunteerDashboard from './pages/dashboards/volunteer/VolunteerDashboard';

const HIDE_NAVBAR = ['/login', '/signup', '/ngo-dashboard'];

const AppContent = () => {
  const path = window.location.pathname;
  const hideNav = HIDE_NAVBAR.includes(path);

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute role="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute role="ngo">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute role="volunteer">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1E293B',
              color: '#FFFFFF',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
