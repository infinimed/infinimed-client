import { config } from '@/config';

export const verifyOTP = async (mobileNumber: string, otp: string) => {
  try {
    const response = await fetch(`${config.backendURL}/api/otp/verify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileNumber: mobileNumber,
        otp: otp,
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Network error during OTP verification:', error);
    throw new Error('Network error. Please check your connection and try again.');
  }
};
