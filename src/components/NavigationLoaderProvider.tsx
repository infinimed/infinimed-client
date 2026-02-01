'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type NavigationLoaderContextValue = {
  loading: boolean;
  start: () => void;
  stop: () => void;
};

const NavigationLoaderContext =
  createContext<NavigationLoaderContextValue | null>(null);

const AUTO_HIDE_MS = 8000;

export function NavigationLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    setLoading(false);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      timeoutRef.current = null;
    }, AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    stop();
  }, [pathname, search, stop]);

  const value = useMemo(
    () => ({
      loading,
      start,
      stop,
    }),
    [loading, start, stop],
  );

  return (
    <NavigationLoaderContext.Provider value={value}>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-indigo-200">
          <div className="h-full w-2/5 bg-indigo-600 loading-bar-animate" />
        </div>
      )}
      {children}
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);
  if (!context) {
    return {
      loading: false,
      start: () => {},
      stop: () => {},
    };
  }
  return context;
}
