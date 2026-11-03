// pages/otp.tsx
'use client';
import React from 'react';
import OTPForm from './components/OTPForm';

const OTPPage: React.FC = () => {
  const handleSubmit = (otp: string) => {
    alert(`OTP submitted: ${otp}`);
  };

  return (
    <div className="w-full flex justify-center px-4 py-10 lg:py-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter OTP</h1>
        <OTPForm onSubmit={handleSubmit} length={6} />
      </div>
    </div>
  );
};

export default OTPPage;
