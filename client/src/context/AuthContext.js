import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import axios from 'axios';

const AuthContext = createContext();

const API_URL =
  "https://sharebite-backend-uucd.onrender.com/api";


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // =========================
  // RESTORE LOGIN SESSION
  // =========================
  useEffect(() => {

    const stored =
      localStorage.getItem('sharebite_user');

    if (stored) {

      const parsed =
        JSON.parse(stored);

      setUser(parsed);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${parsed.token}`;
    }

    setLoading(false);

  }, []);


  // =========================
  // LOGIN
  // =========================
  const login = async (
    email,
    password
  ) => {

    const { data } =
      await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password
        }
      );

    setUser(data);

    localStorage.setItem(
      'sharebite_user',
      JSON.stringify(data)
    );

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${data.token}`;

    return data;
  };


  // =========================
  // SIGNUP
  // =========================
  const signup = async (
    name,
    email,
    password,
    role,
    ngoCertificate,
    idProofType,
    idProof
  ) => {

    const { data } =
      await axios.post(
        `${API_URL}/auth/signup`,
        {
          name,
          email,
          password,
          role,

          // NGO CERTIFICATE
          ngoCertificate,

          // VOLUNTEER ID PROOF
          idProofType,
          idProof
        }
      );

    setUser(data);

    localStorage.setItem(
      'sharebite_user',
      JSON.stringify(data)
    );

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${data.token}`;

    return data;
  };


  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    setUser(null);

    localStorage.removeItem(
      'sharebite_user'
    );

    delete axios.defaults.headers.common[
      'Authorization'
    ];
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () =>
  useContext(AuthContext);