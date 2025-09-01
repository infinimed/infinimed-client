'use client';
import React, { useState, useEffect } from 'react';
import OTPForm from '../components/OTPForm';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyOTP } from '@/services/verifyOTP';
import { resendOTP } from '@/services/resendOTP';
import { useAppDispatch } from '@/lib/hooks';
import { setIsLoggedIn } from '@/lib/features/auth/isLoggedIn';
import { toast } from '@/hooks/use-toast';

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
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Start countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  // Handle resend OTP button click
  const handleResendOTP = () => {
    setResendDisabled(true);
    setCountdown(30);
    
    resendOTP(mobileNumber)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast({
            title: "OTP Resent",
            description: "A new verification code has been sent to your phone.",
          });
        } else {
          setError(res.message || 'Failed to resend OTP. Please try again.');
          setResendDisabled(false);
          setCountdown(0);
        }
      })
      .catch(() => {
        setError('Failed to resend OTP. Please try again.');
        setResendDisabled(false);
        setCountdown(0);
      });
  };

  const handleSubmit = async (otp: string) => {
    try {
      setError('');
      
      // Validate OTP length first
      if (otp.length !== 6) {
        setError('Please enter the full 6-digit OTP');
        return;
      }
      
      setLoading(true);
      
      const res = await verifyOTP(mobileNumber, otp);
      const data = await res.json();
      
      // Check if the response indicates an error
      if (!res.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }
      
      // Check verification status
      if (data.verified === true) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          dispatch(setIsLoggedIn(true));
          toast({
            title: "Login Successful",
            description: "You have been successfully logged in.",
          });
          
          // Handle redirects based on parameters
          if (service_id !== 'null') {
            router.push(
              `/issue/docs?service_id=${service_id}&service_name=${service_name}&price=${price}`,
            );
          } else if (from_cart !== null) {
            router.push(`/`);
          } else {
            router.push(`/`);
          }
        } else {
          // User needs to sign up
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
      } else {
        // Verification failed
        setError('Please enter the correct OTP');
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "The OTP you entered is incorrect. Please try again."
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneForDisplay = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 mb-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter OTP</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">
          We&apos;ve sent a 6-digit verification code to <br />
          <span className="font-medium">{formatPhoneForDisplay(mobileNumber)}</span>
        </p>
        <OTPForm
          onSubmit={handleSubmit}
          length={6}
          error={error}
          loading={loading}
        />
        <div className="mt-4 text-center">
          <button
            type="button"
            className={`text-sm font-medium ${
              resendDisabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-700 hover:text-indigo-900'
            }`}
            onClick={handleResendOTP}
            disabled={resendDisabled}
          >
            {resendDisabled
              ? `Resend code in ${countdown}s`
              : 'Resend verification code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
