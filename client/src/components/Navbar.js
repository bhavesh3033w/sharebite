import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'donor') return '/donor-dashboard';
    if (user.role === 'ngo') return '/ngo-dashboard';
    if (user.role === 'volunteer') return '/volunteer-dashboard';
    return '/';
  };

  return (
    <nav style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}>
              🍱
            </div>
            <div>
              <span className="font-bold text-xl" style={{ color: '#FF6B35' }}>ShareBite</span>
              <p className="text-xs hidden sm:block" style={{ color: '#6B7280', lineHeight: '1' }}>Share Food, Share Kindness</p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-sm font-medium px-4 py-2 rounded-xl transition-all"
                  style={{ color: '#2D2D2D' }}
                  onMouseEnter={e => e.target.style.background = '#FFF7F2'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: '#FFF7F2' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#FF6B35' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium" style={{ color: '#2D2D2D' }}>{user.name}</p>
                    <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-2 rounded-xl border transition-all"
                  style={{ color: '#FF6B35', borderColor: '#FF6B35' }}
                  onMouseEnter={e => { e.target.style.background = '#FF6B35'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#FF6B35'; }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-2 rounded-xl transition-all"
                  style={{ color: '#2D2D2D' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium px-5 py-2 rounded-xl text-white transition-all"
                  style={{ background: '#FF6B35' }}
                  onMouseEnter={e => e.target.style.background = '#E55A25'}
                  onMouseLeave={e => e.target.style.background = '#FF6B35'}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
