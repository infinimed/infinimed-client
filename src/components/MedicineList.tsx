'use client';
import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import MedicineCard from './MedicineCard';
import { IMedicine } from '@/interfaces/IMedicine';
import { config } from '@/config';
import { useAppSelector } from '@/lib/hooks';
import Skeleton from './Skeleton';

type MedicineListProps = {
  children?: ReactNode;
};

const PAGE_SIZE = 10;

const MedicineCardSkeleton = () => (
  <div className="w-[45vw] lg:w-[15vw] lg:m-2">
    <Skeleton variant="card" className="w-full h-auto" />
  </div>
);

const MedicineList: React.FC<MedicineListProps> = () => {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // Held in state rather than a ref so the observer effect re-runs once the
  // sentinel actually mounts (it is absent during the initial-load skeleton).
  const [loaderNode, setLoaderNode] = useState<HTMLDivElement | null>(null);

  const medicineSearchResults = useAppSelector(
    (state) => state.medicineSearchResults,
  );

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendURL}/api/medicine?page=${page}`,
      );
      const data = await response.json();
      setMedicines((prev: IMedicine[]) => [...prev, ...data]);
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    // Skipping while loading doubles as the in-flight guard, and rebuilding the
    // observer after each fetch re-fires it when the sentinel is still in view.
    if (!loaderNode || !hasMore || loading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderNode);

    return () => observer.disconnect();
  }, [loaderNode, hasMore, loading]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Show skeleton on initial load
  if (loading && medicines.length === 0 && medicineSearchResults.length === 0) {
    return (
      <div className="flex flex-wrap w-[100vw] lg:w-full justify-evenly lg:justify-start gap-y-3 mt-3 pb-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <MedicineCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap w-[100vw] lg:w-full justify-evenly lg:justify-start gap-y-3 mt-3 pb-20">
      {error && <p className="w-full text-center text-red-600 font-poppins">Faced a server error. Please refresh</p>}

      {(medicineSearchResults.length > 0
        ? (medicineSearchResults as (IMedicine & { _id: string })[])
        : (medicines as (IMedicine & { _id: string })[])
      )?.map((medicine: IMedicine & { _id: string }) => (
        <div key={medicine?._id} className="w-[45vw] lg:w-[15vw] lg:m-2">
          <MedicineCard medicine={medicine} />
        </div>
      ))}
      <div ref={setLoaderNode}></div>
      {loading && medicines.length > 0 && (
        <div className="w-full flex justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <MedicineCardSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
};
export default MedicineList;
