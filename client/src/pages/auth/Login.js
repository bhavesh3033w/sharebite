import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      if (user.role === 'donor') navigate('/donor-dashboard');
      else if (user.role === 'ngo') navigate('/ngo-dashboard');
      else navigate('/volunteer-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FFF7F2' }}>
      {/* Left image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
          alt="Food donation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.7), rgba(46,196,182,0.5))' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="text-5xl mb-4">🍱</div>
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg opacity-90">Continue making a difference in your community.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg" style={{ background: '#FF6B35' }}>🍱</div>
            <span className="text-xl font-bold" style={{ color: '#FF6B35' }}>ShareBite</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Sign in</h1>
          <p className="mb-8" style={{ color: '#6B7280' }}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm"
                style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm"
                style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{ background: loading ? '#FFA07A' : '#FF6B35' }}
            >
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: '#FF6B35' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
