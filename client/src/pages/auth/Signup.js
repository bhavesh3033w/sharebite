import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const roles = [
  { value: 'donor', label: 'Donor', icon: '🍱', desc: 'I want to donate food or clothes' },
  { value: 'ngo', label: 'NGO', icon: '🏢', desc: 'We accept and distribute donations' },
  { value: 'volunteer', label: 'Volunteer', icon: '🙌', desc: 'I want to help with delivery' },
];

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const selectRole = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { toast.error('Please select a role'); return; }
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      toast.success(`Welcome to ShareBite, ${user.name}! 🎉`);
      if (user.role === 'donor') navigate('/donor-dashboard');
      else if (user.role === 'ngo') navigate('/ngo-dashboard');
      else navigate('/volunteer-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FFF7F2' }}>
      {/* Left image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"
          alt="Volunteers helping"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(46,196,182,0.6), rgba(255,107,53,0.5))' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg opacity-90">14,000+ people are already making a difference.</p>
          <div className="mt-8 space-y-3">
            {['✓ Free to join', '✓ Trusted by 340+ NGOs', '✓ Real-time tracking'].map(t => (
              <p key={t} className="text-base opacity-90">{t}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg" style={{ background: '#FF6B35' }}>🍱</div>
            <span className="text-xl font-bold" style={{ color: '#FF6B35' }}>ShareBite</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Create account</h1>
          <p className="mb-7" style={{ color: '#6B7280' }}>Join thousands already sharing kindness</p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: '#2D2D2D' }}>I am joining as a...</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => selectRole(r.value)}
                  className="p-3 rounded-xl border-2 text-center transition-all"
                  style={{
                    borderColor: form.role === r.value ? '#FF6B35' : '#E5E7EB',
                    background: form.role === r.value ? '#FFF7F2' : '#FFFFFF',
                  }}
                >
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <p className="text-xs font-semibold" style={{ color: form.role === r.value ? '#FF6B35' : '#2D2D2D' }}>{r.label}</p>
                  <p className="text-xs mt-0.5 hidden sm:block" style={{ color: '#6B7280', fontSize: '10px' }}>{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Full name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm"
                style={{ borderColor: '#E5E7EB' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm"
                style={{ borderColor: '#E5E7EB' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange} required minLength="6"
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm"
                style={{ borderColor: '#E5E7EB' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2"
              style={{ background: loading ? '#FFA07A' : '#FF6B35' }}
            >
              {loading ? <><Spinner size="sm" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <p className="text-center mt-5 text-sm" style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#FF6B35' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
