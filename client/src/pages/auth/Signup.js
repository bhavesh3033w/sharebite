import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const roles = [
  { value: 'donor', label: 'Donor', icon: '🍱' },
  { value: 'ngo', label: 'NGO', icon: '🏢' },
  { value: 'volunteer', label: 'Volunteer', icon: '🙌' }
];

const API_URL =
  'https://sharebite-backend-uucd.onrender.com/api';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  // NGO Certificate
  const [certificateFile, setCertificateFile] = useState(null);

  // Volunteer ID Proof
  const [idProofType, setIdProofType] = useState('');
  const [idProofFile, setIdProofFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();


  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  // =========================
  // ROLE SELECT
  // =========================
  const selectRole = (role) => {
    setForm({
      ...form,
      role
    });

    // Reset documents when role changes
    setCertificateFile(null);
    setIdProofFile(null);
    setIdProofType('');
  };


  // =========================
  // UPLOAD FILE TO CLOUDINARY
  // THROUGH BACKEND
  // =========================
  const uploadDocument = async (file) => {
    const formData = new FormData();

    formData.append(
      'certificate',
      file
    );

    const response = await fetch(
      `${API_URL}/upload/certificate`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Document upload failed'
      );
    }

    if (!data.filePath) {
      throw new Error(
        'Upload succeeded but file URL was not returned'
      );
    }

    return data.filePath;
  };


  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role) {
      toast.error('Please select a role');
      return;
    }


    // NGO VALIDATION
    if (
      form.role === 'ngo' &&
      !certificateFile
    ) {
      toast.error(
        'Please upload NGO Registration Certificate'
      );
      return;
    }


    // VOLUNTEER VALIDATION
    if (
      form.role === 'volunteer' &&
      !idProofType
    ) {
      toast.error(
        'Please select an ID Proof type'
      );
      return;
    }


    if (
      form.role === 'volunteer' &&
      !idProofFile
    ) {
      toast.error(
        'Please upload your ID Proof document'
      );
      return;
    }


    setLoading(true);

    try {
      let uploadedCertificate = '';
      let uploadedIdProof = '';


      // =========================
      // NGO CERTIFICATE UPLOAD
      // =========================
      if (
        form.role === 'ngo' &&
        certificateFile
      ) {
        uploadedCertificate =
          await uploadDocument(
            certificateFile
          );

        console.log(
          'NGO Certificate:',
          uploadedCertificate
        );
      }


      // =========================
      // VOLUNTEER ID PROOF UPLOAD
      // =========================
      if (
        form.role === 'volunteer' &&
        idProofFile
      ) {
        uploadedIdProof =
          await uploadDocument(
            idProofFile
          );

        console.log(
          'Volunteer ID Proof:',
          uploadedIdProof
        );
      }


      // =========================
      // CREATE USER
      // =========================
      const user = await signup(
        form.name,
        form.email,
        form.password,
        form.role,
        uploadedCertificate,
        idProofType,
        uploadedIdProof
      );


      toast.success(
        `Welcome ${user.name}!`
      );


      // =========================
      // REDIRECT
      // =========================
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

      console.error(
        'Signup Error:',
        err
      );

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Signup failed'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{
        background: '#FFF7F2'
      }}
    >

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 relative">

        <img
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"
          alt="volunteer"
          className="w-full h-full object-cover"
        />

      </div>


      {/* RIGHT SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">


          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-8"
          >

            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{
                background: '#FF6B35'
              }}
            >
              🍱
            </div>

            <span
              className="text-xl font-bold"
              style={{
                color: '#FF6B35'
              }}
            >
              ShareBite
            </span>

          </Link>


          <h1 className="text-3xl font-bold mb-6">
            Create Account
          </h1>


          {/* ROLE SELECT */}
          <div className="mb-6">

            <label className="block mb-3">
              Select Role
            </label>

            <div className="grid grid-cols-3 gap-4">

              {roles.map((r) => (

                <button
                  key={r.value}
                  type="button"
                  onClick={() =>
                    selectRole(r.value)
                  }
                  className="p-4 border rounded-xl transition-colors"
                  style={{
                    borderColor:
                      form.role === r.value
                        ? '#FF6B35'
                        : '#ddd'
                  }}
                >

                  <div className="text-2xl">
                    {r.icon}
                  </div>

                  <div>
                    {r.label}
                  </div>

                </button>

              ))}

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
            />


            {/* EMAIL */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
            />


            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              minLength="6"
              className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
            />


            {/* =========================
                NGO CERTIFICATE
            ========================== */}
            {form.role === 'ngo' && (

              <div>

                <label className="block mb-2 font-medium">
                  Upload NGO Registration Certificate
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setCertificateFile(
                      e.target.files[0]
                    )
                  }
                  className="w-full"
                />

                {certificateFile && (

                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {certificateFile.name}
                  </p>

                )}

              </div>

            )}


            {/* =========================
                VOLUNTEER ID PROOF
            ========================== */}
            {form.role === 'volunteer' && (

              <div className="space-y-4">


                {/* ID TYPE */}
                <div>

                  <label className="block mb-2 font-medium">
                    Select ID Proof
                  </label>

                  <select
                    value={idProofType}
                    onChange={(e) =>
                      setIdProofType(
                        e.target.value
                      )
                    }
                    className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
                    required
                  >

                    <option value="">
                      Choose ID Proof
                    </option>

                    <option value="Aadhaar Card">
                      Aadhaar Card
                    </option>

                    <option value="Voter ID">
                      Voter ID
                    </option>

                    <option value="Driving Licence">
                      Driving Licence
                    </option>

                  </select>

                </div>


                {/* ID DOCUMENT */}
                <div>

                  <label className="block mb-2 font-medium">
                    Upload ID Proof Document
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setIdProofFile(
                        e.target.files[0]
                      )
                    }
                    className="w-full"
                  />

                  {idProofFile && (

                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {idProofFile.name}
                    </p>

                  )}

                </div>

              </div>

            )}


            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition-opacity mt-4"
              style={{
                background: '#FF6B35',
                opacity: loading
                  ? 0.7
                  : 1
              }}
            >

              {loading
                ? 'Creating Account...'
                : 'Create Account'
              }

            </button>

          </form>


          <p className="mt-5 text-center">

            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{
                color: '#FF6B35'
              }}
            >
              Sign In
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;