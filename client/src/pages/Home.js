import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '12,400+', label: 'Meals Donated' },
  { value: '340+', label: 'NGO Partners' },
  { value: '2,100+', label: 'Volunteers' },
  { value: '98%', label: 'Satisfaction' },
];

const features = [
  {
    icon: '🍱',
    title: 'Donate Food & Clothes',
    desc: 'List your surplus food or gently used clothing in seconds and connect with NGOs ready to distribute.',
    color: '#FFF7F2',
    border: '#FFD7C7',
  },
  {
    icon: '🏢',
    title: 'NGO Management',
    desc: 'NGOs get a powerful admin panel to review, accept, and coordinate incoming donations efficiently.',
    color: '#F0FDFB',
    border: '#B2EFE8',
  },
  {
    icon: '🙌',
    title: 'Volunteer Network',
    desc: 'Register your skills and availability. Help with pickups, deliveries, and on-ground distribution.',
    color: '#FFF7F2',
    border: '#FFD7C7',
  },
];

const howItWorks = [
  { step: '01', title: 'Create an Account', desc: 'Sign up as a Donor, NGO, or Volunteer in under a minute.' },
  { step: '02', title: 'Post or Accept', desc: 'Donors post donations. NGOs accept them. Volunteers assist.' },
  { step: '03', title: 'Make an Impact', desc: 'Track your contribution and see the real-world difference.' },
];

const Home = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (user?.role === 'donor') return '/donor-dashboard';
    if (user?.role === 'ngo') return '/ngo-dashboard';
    if (user?.role === 'volunteer') return '/volunteer-dashboard';
    return '/signup';
  };

  return (
    <div style={{ background: '#FFF7F2', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: '#FFE8DE', color: '#FF6B35' }}
              >
                🌟 Social Impact Platform
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: '#2D2D2D' }}>
                Share Food,<br />
                <span style={{ color: '#FF6B35' }}>Share Kindness</span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#6B7280' }}>
                Connect surplus food and clothing with communities that need it most.
                Join thousands of donors, NGOs, and volunteers making a real difference — one meal at a time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={getDashboardLink()}
                  className="px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all shadow-lg"
                  style={{ background: '#FF6B35', boxShadow: '0 8px 24px rgba(255,107,53,0.35)' }}
                  onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                  {user ? 'Go to Dashboard' : 'Start Donating'}
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3.5 rounded-xl font-semibold text-base border-2 transition-all"
                  style={{ color: '#FF6B35', borderColor: '#FF6B35' }}
                  onMouseEnter={e => { e.target.style.background = '#FF6B35'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#FF6B35'; }}
                >
                  Join as NGO
                </Link>
              </div>
            </div>
            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: '420px' }}>
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80"
                  alt="People sharing food"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(255,107,53,0.15))' }} />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-2xl font-bold" style={{ color: '#FF6B35' }}>12,400+</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Meals shared this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ background: '#FF6B35' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl lg:text-4xl font-bold text-white">{s.value}</p>
                <p className="text-sm mt-1" style={{ color: '#FFD7C7' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2D2D2D' }}>
              How ShareBite Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              A complete ecosystem for food and clothing donation — built for donors, NGOs, and volunteers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-8 transition-all cursor-default"
                style={{ background: f.color, border: `1px solid ${f.border}` }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2D2D2D' }}>{f.title}</h3>
                <p style={{ color: '#6B7280' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: '#F9FFFE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2D2D2D' }}>Simple 3-Step Process</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((h) => (
              <div key={h.step} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5"
                  style={{ background: '#FF6B35', color: 'white' }}
                >
                  {h.step}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#2D2D2D' }}>{h.title}</h3>
                <p style={{ color: '#6B7280' }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg mb-8" style={{ color: '#FFD7C7' }}>
              Join 14,000+ people already sharing food and kindness across communities.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
              style={{ color: '#FF6B35' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              Join ShareBite Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t" style={{ borderColor: '#FFE8DE' }}>
        <p style={{ color: '#6B7280' }}>© 2024 ShareBite — Share Food, Share Kindness 🍱</p>
      </footer>
    </div>
  );
};

export default Home;
