'use client';

import { PhoneInput } from '@/components/PhoneInput';
import { Button } from '@/components/ui/button';
import { validatePhoneNumber } from '@/lib/utils/validatePhoneNumber';
import { sendOTP } from '@/services/sendOTP';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import loader from '@/assets/loader.svg';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const service_id = searchParams.get('service_id');
  const service_name = searchParams.get('service_name');
  const from_cart = searchParams.get('from_cart');
  const price = searchParams.get('price');

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setPhoneNumber(e.currentTarget.value);
  }

  async function handleSubmit() {
    if (validatePhoneNumber(phoneNumber) !== 'success') {
      setError(() => validatePhoneNumber(phoneNumber));
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const res = await sendOTP(phoneNumber);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        router.push(
          `/otp/${phoneNumber}?service_id=${service_id}&service_name=${service_name}&from_cart=${from_cart}&price=${price}`,
        );
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Suspense>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 ">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Enter Phone Number
          </h1>
          <PhoneInput handleChange={handleChange}></PhoneInput>
          {error && (
            <div className="text-red-500 text-sm mt-2 mb-2">{error}</div>
          )}
          <div className="flex flex-col items-end">
            <Button
              className="h-14 text-xl mt-2 w-full bg-indigo-900"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Image
                  className="w-[2rem] h-[2rem] text-white"
                  src={loader}
                  alt="loader"
                />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
