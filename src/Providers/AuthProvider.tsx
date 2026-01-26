'use client';
import { setIsLoggedIn } from '@/lib/features/auth/isLoggedIn';
import { useAppDispatch } from '@/lib/hooks';
import { isLoggedIn } from '@/services/isLoggedIn';
import { useEffect } from 'react';

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      isLoggedIn(token)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.userId) {
            dispatch(setIsLoggedIn(true));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [dispatch]);

  return <>{children}</>;
}
