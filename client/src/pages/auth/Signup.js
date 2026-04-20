import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const roles = [
  { value: 'donor', label: 'Donor', icon: '🍱' },
  { value: 'ngo', label: 'NGO', icon: '🏢' },
  { value: 'volunteer', label: 'Volunteer', icon: '🙌' }
];

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const [certificateFile, setCertificateFile] = useState(null);
  const [idProofType, setIdProofType] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectRole = (role) => {
    setForm({ ...form, role });
  };

  const handleCertificateUpload = (e) => {
    setCertificateFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role) {
      toast.error('Please select a role');
      return;
    }

    // UPDATED CONDITION 1
    if ((form.role === 'ngo' || form.role === 'volunteer') && !certificateFile) {
      toast.error(form.role === 'ngo' ? 'Please upload NGO Registration Certificate' : 'Please upload your ID Proof document');
      return;
    }

    setLoading(true);

    try {
      let uploadedCertificate = '';

      // UPDATED CONDITION 2
      if ((form.role === 'ngo' || form.role === 'volunteer') && certificateFile) {
        const formData = new FormData();
        formData.append('certificate', certificateFile);

        const uploadRes = await fetch('https://your-render-backend.onrender.com/api/upload/certificate', {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadRes.json();
        uploadedCertificate = uploadData.filePath;
        console.log('Uploaded:', uploadedCertificate);
      }

      // SIGNUP WITH CERTIFICATE AND ID PROOF TYPE
      const user = await signup(
        form.name,
        form.email,
        form.password,
        form.role,
        uploadedCertificate,
        idProofType
      );

      toast.success(`Welcome ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else if (user.role === 'ngo') {
        navigate('/ngo-dashboard');
      } else {
        navigate('/volunteer-dashboard');
      }

    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FFF7F2' }}>
      
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"
          alt="volunteer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: '#FF6B35' }}
            >
              🍱
            </div>
            <span className="text-xl font-bold" style={{ color: '#FF6B35' }}>
              ShareBite
            </span>
          </Link>

          <h1 className="text-3xl font-bold mb-6">Create Account</h1>

          <div className="mb-6">
            <label className="block mb-3">Select Role</label>
            <div className="grid grid-cols-3 gap-4">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => selectRole(r.value)}
                  className="p-4 border rounded-xl transition-colors"
                  style={{ borderColor: form.role === r.value ? '#FF6B35' : '#ddd' }}
                >
                  <div className="text-2xl">{r.icon}</div>
                  <div>{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
            />

            {/* NGO Certificate Upload Block */}
            {form.role === 'ngo' && (
              <div>
                <label className="block mb-2 font-medium">Upload NGO Registration Certificate</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={handleCertificateUpload}
                  className="w-full"
                />
                {certificateFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {certificateFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Volunteer ID Proof Dropdown & Upload Block */}
            {form.role === 'volunteer' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Select ID Proof</label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value)}
                    className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
                  >
                    <option value="">Choose ID Proof</option>
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving Licence">Driving Licence</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Upload ID Proof Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={handleCertificateUpload}
                    className="w-full"
                  />
                  {certificateFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {certificateFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition-opacity mt-4"
              style={{ background: '#FF6B35', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#FF6B35' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;