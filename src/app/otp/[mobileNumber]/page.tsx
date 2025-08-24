// pages/otp.tsx
'use client';
import React, { useState } from 'react';
import OTPForm from '../components/OTPForm';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyOTP } from '@/services/verifyOTP';
import { useAppDispatch } from '@/lib/hooks';
import { setIsLoggedIn } from '@/lib/features/auth/isLoggedIn';

const OTPPage: React.FC = () => {
  const { mobileNumber }: { mobileNumber: string } = useParams();
  const searchParams = useSearchParams();
  const service_id = searchParams.get('service_id');
  const service_name = searchParams.get('service_name');
  const from_cart = searchParams.get('from_cart');
  const price = searchParams.get('price');

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (otp: string) => {
    setError('');
    if (otp.length === 6) {
      setLoading(true);
      verifyOTP(mobileNumber, otp)
        .then((res) => res.json())
        .then((res) => {
          if (res.verified === true) {
            if (res.token) {
              localStorage.setItem('token', res.token);
              dispatch(setIsLoggedIn(true));
              if (service_id !== 'null') {
                router.push(
                  `/issue/docs?service_id=${service_id}&service_name=${service_name}&price=${price}`,
                );
              } else if (from_cart !== null) {
                // Previously redirected to cart when login originated from cart.
                // Change: Route to homepage instead after successful login.
                router.push(`/`);
              } else {
                router.push(`/`);
              }
            } else {
              if (service_id !== 'null') {
                router.push(
                  `/signup?service_id=${service_id}&service_name=${service_name}&phone_number=${mobileNumber}&price=${price}`,
                );
              } else if (from_cart === 'true') {
                router.push(
                  `/signup?phone_number=${mobileNumber}&from_cart=true`,
                );
              } else {
                router.push(`/signup?phone_number=${mobileNumber}`);
              }
            }
          } else if (res.verified === false) {
            setLoading(false);
            setError('please enter the correct OTP');
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          console.log(error);
        });
    } else {
      setError('Please enter the full OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter OTP</h1>
        <OTPForm
          onSubmit={handleSubmit}
          length={6}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default OTPPage;
