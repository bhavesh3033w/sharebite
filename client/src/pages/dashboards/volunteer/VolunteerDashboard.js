import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { volunteerAPI } from '../../../services/api';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';

const tips = [
  {
    icon: '📦',
    title: 'Help with Pickups',
    desc: 'Collect donations from donor addresses and transport to NGO centers.',
  },
  {
    icon: '🚚',
    title: 'Delivery Runs',
    desc: 'Help NGOs distribute food and clothes to families in need.',
  },
  {
    icon: '📋',
    title: 'On-Ground Support',
    desc: 'Assist at NGO events, manage queues, and support distribution drives.',
  },
];

const VolunteerDashboard = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    skills: '',
    contact: '',
    availabilityStatus: 'Available'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await volunteerAPI.register(form);

      toast.success("You're registered as a volunteer! 🎉");

      setSubmitted(true);

    } catch (err) {

      toast.error(
        err.response?.data?.message || 'Registration failed'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ background: '#FFF7F2', minHeight: '100vh' }}>
      
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2EC4B6, #1A9E92)'
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b7?w=1200&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background:'rgba(255,255,255,0.2)',
              color:'white'
            }}
          >
            🙌 Volunteer Portal
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Hello, {user?.name}! 👋
          </h1>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{
              color:'rgba(255,255,255,0.85)'
            }}
          >
            Your time and skills can feed families.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT SIDE FORM */}
          <div>

            <h2
              className="text-xl font-bold mb-2"
              style={{ color:'#2D2D2D' }}
            >
              Volunteer Registration
            </h2>

            {submitted ? (

              <div
                className="bg-white rounded-2xl p-10 text-center border shadow-sm"
                style={{ borderColor:'#B2EFE8' }}
              >
                <div className="text-6xl mb-4">
                  🎉
                </div>

                <h3 className="text-xl font-bold mb-2">
                  You're registered!
                </h3>

                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl text-white"
                  style={{ background:'#2EC4B6' }}
                >
                  Update Details
                </button>

              </div>

            ) : (

              <div
                className="bg-white rounded-2xl p-7 border shadow-sm"
                style={{ borderColor:'#E5E7EB' }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Name */}
                  <div>
                    <label className="block mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e)=>
                        setForm({
                          ...form,
                          name:e.target.value
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>


                  {/* Skills */}
                  <div>
                    <label className="block mb-2">
                      Your Skills
                    </label>

                    <input
                      type="text"
                      required
                      value={form.skills}
                      onChange={(e)=>
                        setForm({
                          ...form,
                          skills:e.target.value
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>


                  {/* Contact */}
                  <div>
                    <label className="block mb-2">
                      Phone / Contact
                    </label>

                    <input
                      type="text"
                      required
                      value={form.contact}
                      onChange={(e)=>
                        setForm({
                          ...form,
                          contact:e.target.value
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>


                  {/* NEW AVAILABILITY FIELD */}
                  <div>
                    <label className="block mb-2">
                      Availability Status
                    </label>

                    <select
                      value={form.availabilityStatus}
                      onChange={(e)=>
                        setForm({
                          ...form,
                          availabilityStatus:e.target.value
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    >
                      <option value="Available">
                        Available
                      </option>

                      <option value="Busy">
                        Busy
                      </option>

                      <option value="Not Available">
                        Not Available
                      </option>

                    </select>
                  </div>


                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{
                      background: loading
                        ? '#7DDED7'
                        : '#2EC4B6'
                    }}
                  >
                    {loading
                      ? (
                        <>
                          <Spinner size="sm" />
                          Registering...
                        </>
                      )
                      : 'Register as Volunteer 🙌'
                    }

                  </button>

                </form>

              </div>

            )}

          </div>


          {/* RIGHT SIDE */}
          <div>

            <h2 className="text-xl font-bold mb-6">
              How You Can Help
            </h2>

            <div className="space-y-4">

              {tips.map((t)=>(
                <div
                  key={t.title}
                  className="bg-white rounded-2xl p-5 border flex gap-4"
                >
                  <div className="text-2xl">
                    {t.icon}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {t.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.desc}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VolunteerDashboard;