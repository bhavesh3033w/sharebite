import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { volunteerAPI } from '../../../services/api';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';

const tips = [
  { icon: '📦', title: 'Help with Pickups', desc: 'Collect donations from donor addresses and transport to NGO centers.' },
  { icon: '🚚', title: 'Delivery Runs', desc: 'Help NGOs distribute food and clothes to families in need.' },
  { icon: '📋', title: 'On-Ground Support', desc: 'Assist at NGO events, manage queues, and support distribution drives.' },
];

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', skills: '', contact: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await volunteerAPI.register(form);
      toast.success('You\'re registered as a volunteer! 🎉');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#FFF7F2', minHeight: '100vh' }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2EC4B6, #1A9E92)' }}>
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b7?w=1200&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            🙌 Volunteer Portal
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Your time and skills can feed families. Register to start volunteering with NGOs in your area.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Volunteer Registration</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Fill in your details and we'll match you with NGOs in your area.</p>

            {submitted ? (
              <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: '#B2EFE8' }}>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2D2D2D' }}>You're registered!</h3>
                <p className="mb-6" style={{ color: '#6B7280' }}>
                  An NGO will reach out to you soon. Thank you for your kindness!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ background: '#2EC4B6' }}
                >
                  Update Details
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-7 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Full Name</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                      style={{ borderColor: '#E5E7EB' }}
                      onFocus={e => e.target.style.borderColor = '#2EC4B6'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Your Skills</label>
                    <input
                      type="text" required
                      value={form.skills}
                      onChange={e => setForm({ ...form, skills: e.target.value })}
                      placeholder="e.g. Driving, Cooking, Packing, First Aid"
                      className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                      style={{ borderColor: '#E5E7EB' }}
                      onFocus={e => e.target.style.borderColor = '#2EC4B6'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Phone / Contact</label>
                    <input
                      type="text" required
                      value={form.contact}
                      onChange={e => setForm({ ...form, contact: e.target.value })}
                      placeholder="Your phone number or WhatsApp"
                      className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                      style={{ borderColor: '#E5E7EB' }}
                      onFocus={e => e.target.style.borderColor = '#2EC4B6'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: loading ? '#7DDED7' : '#2EC4B6' }}
                  >
                    {loading ? <><Spinner size="sm" /> Registering...</> : 'Register as Volunteer 🙌'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* How to help */}
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#2D2D2D' }}>How You Can Help</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>There are many ways to contribute your time and energy.</p>

            <div className="space-y-4">
              {tips.map(t => (
                <div
                  key={t.title}
                  className="bg-white rounded-2xl p-5 border flex gap-4 items-start"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#F0FDFB' }}>
                    {t.icon}
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#2D2D2D' }}>{t.title}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact card */}
            <div
              className="mt-6 rounded-2xl p-6 text-center overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #2EC4B6, #1A9E92)' }}
            >
              <p className="text-4xl font-bold text-white">2,100+</p>
              <p className="text-white mt-1 mb-3">Active Volunteers Nationwide</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Join them and be part of the largest food sharing movement in the country.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
