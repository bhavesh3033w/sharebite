import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({
  children,
  role
}) => {

  const {
    user,
    loading
  } = useAuth();


  if (loading)
    return (
      <Spinner
        center
        size="lg"
      />
    );


  // Not logged in
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
      />
    );


  // NEW STEP 3
  // Block pending NGO & Volunteers
  if (

    user.role !== 'donor' &&

    user.verificationStatus === 'Pending'

  ) {

    return (

      <div
        style={{
          minHeight:'100vh',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          background:'#FFF7F2'
        }}
      >

        <div
          style={{
            background:'white',
            padding:'40px',
            borderRadius:'20px',
            textAlign:'center',
            boxShadow:
            '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >

          <div
            style={{
              fontSize:'60px',
              marginBottom:'20px'
            }}
          >
            ⏳
          </div>

          <h1
            style={{
              color:'#2D2D2D'
            }}
          >
            Awaiting Admin Approval
          </h1>

          <p
            style={{
              color:'#6B7280',
              marginTop:'10px'
            }}
          >
            Your account is under review.

            Please wait until admin approves
            your registration.
          </p>

        </div>

      </div>

    );

  }


  // Role protection
  if (
    role &&
    user.role !== role
  ) {

    if (user.role === 'donor')
      return (
        <Navigate
          to="/donor-dashboard"
          replace
        />
      );

    if (user.role === 'ngo')
      return (
        <Navigate
          to="/ngo-dashboard"
          replace
        />
      );

    if (user.role === 'volunteer')
      return (
        <Navigate
          to="/volunteer-dashboard"
          replace
        />
      );

  }


  return children;

};


export default ProtectedRoute;