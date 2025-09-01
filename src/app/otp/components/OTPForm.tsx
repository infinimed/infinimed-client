'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Form from '@radix-ui/react-form';
import OTPInput from './OTPInput';
import Button from '@/components/Button';
import Image from 'next/image';
import loader from '@/assets/loader.svg';

interface OTPFormProps {
  onSubmit: (otp: string) => void;
  length?: number;
  error?: string;
  loading?: boolean;
}

const OTPForm: React.FC<OTPFormProps> = ({
  onSubmit,
  length = 6,
  error,
  loading,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hiddenOtpRef = useRef<HTMLInputElement | null>(null);
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const [isPasting, setIsPasting] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    // For iOS, focusing a one-time-code input can help trigger SMS AutoFill
    if (isIOS) {
      setTimeout(() => hiddenOtpRef.current?.focus(), 250);
    }
  }, [isIOS]);

  // Callback to apply full code into segmented inputs and optionally auto-submit
  const applyCodeToInputs = useCallback(
    (code: string) => {
      const clean = code.replace(/\D/g, '').slice(0, length);
      const filled = Array.from({ length }, (_, i) => clean[i] ?? '');
      setOtp(filled);
      inputRefs.current[Math.min(clean.length, length - 1)]?.focus();
      if (clean.length === length) {
        onSubmit(clean);
      }
    },
    [length, onSubmit],
  );

  // Attempt auto-retrieval via Web OTP API on supported browsers (Android Chrome, HTTPS)
  useEffect(() => {
    // Guard: only run in browser and when the API is present
    if (typeof window === 'undefined') return;
    
    // Check if Web OTP API is available
    if (!('OTPCredential' in window)) return;
    
    const ac = new AbortController();
    const timeoutId = window.setTimeout(() => ac.abort(), 60_000); // abort after 60s
    
    // Wrapper for the Web OTP API
    async function getOTPCode() {
      try {
        // Use casting to work with the experimental API
        const getCredential = navigator.credentials.get as (options: {
          otp: { transport: string[] };
          signal: AbortSignal;
        }) => Promise<{ code: string } | null>;
        
        const credential = await getCredential({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        });
        
        const code = credential?.code || '';
        if (code) {
          applyCodeToInputs(code);
        }
      } catch (err) {
        // Silent error handling - let users input manually
        console.log('Web OTP API error (non-critical):', err);
      }
    }
    
    // Start the OTP retrieval process
    getOTPCode();
    
    return () => {
      window.clearTimeout(timeoutId);
      ac.abort();
    };
  }, [length, applyCodeToInputs]);

  // moved below distributeAndFocus

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (otp[index] !== '') {
        handleChange('', index);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text/plain')
      .replace(/\D/g, '')
      .slice(0, length);
  distributeAndFocus(pastedData, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === length) {
      onSubmit(otpString);
    }
  };

  const inputRefCallback = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  // Helpers
  const distributeAndFocus = useCallback(
    (digits: string, startIndex: number) => {
      if (!digits) return;
      const clean = digits.replace(/\D/g, '').slice(0, length - startIndex);
      setOtp((prev) => {
        const newOtp = [...prev];
        for (let i = 0; i < clean.length; i += 1) {
          const target = startIndex + i;
          if (target < length) newOtp[target] = clean[i] ?? '';
        }
        return newOtp;
      });
      const focusTo = Math.min(startIndex + clean.length, length - 1);
      inputRefs.current[focusTo]?.focus();
    },
    [length],
  );

  const handleChange = useCallback(
    (value: string, index: number) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 1) {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = digits;
          return next;
        });
        if (digits !== '' && index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        return;
      }

      // If multiple digits are inserted (iOS SMS AutoFill or manual paste into one box), distribute from current index
      distributeAndFocus(digits, index);
    },
    [length, distributeAndFocus],
  );

  // applyCodeToInputs defined above with useCallback

  return (
    <Form.Root onSubmit={handleSubmit}>
      {/* Hidden unified input for SMS AutoFill (iOS) and Web OTP API (Android) */}
      <input
        ref={hiddenOtpRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        enterKeyHint="done"
        className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0 pointer-events-none"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          const digits = e.currentTarget.value.replace(/\D/g, '').slice(0, length);
          if (digits) applyCodeToInputs(digits);
        }}
      />
      <div className="flex justify-between mb-3">
        {otp.map((data, index) => (
          <OTPInput
            key={index}
            value={data}
            onChange={(value) => handleChange(value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            index={index}
            ref={inputRefCallback(index)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mb-6 text-sm">
        <span className="text-gray-500">Enter the 6-digit code</span>
        {typeof navigator !== 'undefined' && navigator.clipboard && (
          <button
            type="button"
            className="text-indigo-700 hover:text-indigo-900 disabled:opacity-50"
            onClick={async () => {
              try {
                setIsPasting(true);
                const text = await navigator.clipboard.readText();
                const digits = text.replace(/\D/g, '').slice(0, length);
                if (digits.length === length) {
                  applyCodeToInputs(digits);
                } else if (digits.length > 0) {
                  distributeAndFocus(digits, 0);
                }
              } catch (err) {
                console.error('Clipboard read error:', err);
              } finally {
                setIsPasting(false);
              }
            }}
            disabled={isPasting}
            aria-busy={isPasting}
          >
            {isPasting ? 'Pasting…' : 'Paste code'}
          </button>
        )}
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-500 font-medium">{error}</div>
      )}
      <Form.Submit asChild>
        <Button
          className="flex w-full bg-indigo-900 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors justify-center"
          type="submit"
          disabled={loading || otp.some(digit => !digit)}
          loading={loading}
        >
          {loading ? (
            <Image
              className="w-[2rem] h-[2rem] text-white"
              src={loader}
              alt="loader"
              width={32}
              height={32}
            />
          ) : (
            <p>Verify Code</p>
          )}
        </Button>
      </Form.Submit>
    </Form.Root>
  );
};

export default OTPForm;
