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

function LoginForm() {
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
      const data = await res.json().catch(() => null);

      if (data?.success) {
        router.push(
          `/otp/${phoneNumber}?service_id=${service_id}&service_name=${service_name}&from_cart=${from_cart}&price=${price}`,
        );
        return;
      }

      // Surface what the server actually said instead of a generic message -
      // an OTP can fail to be stored even after the SMS has gone out.
      setError(
        data?.message ||
          `Failed to send OTP (status ${res.status}). Please try again.`,
      );
    } catch (error) {
      console.error('OTP Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex justify-center px-4 py-10 lg:py-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center font-poppins">
          Enter Phone Number
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          We&apos;ll text you a 6-digit verification code.
        </p>
        <PhoneInput handleChange={handleChange}></PhoneInput>
        {error && <div className="text-red-500 text-sm mt-2 mb-2">{error}</div>}
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
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
