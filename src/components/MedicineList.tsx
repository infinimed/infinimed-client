'use client';
import React, { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import MedicineCard from './MedicineCard';
import { IMedicine } from '@/interfaces/IMedicine';
import { config } from '@/config';
import { useAppSelector } from '@/lib/hooks';
import Skeleton from './Skeleton';

type MedicineListProps = {
  children?: ReactNode;
};

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
  const loader = useRef(null);

  const medicineSearchResults = useAppSelector(
    (state) => state.medicineSearchResults,
  );

  const fetchMedicines = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.backendURL}/api/medicine?page=${page}`,
      );
      const data = await response.json();
      setMedicines((prev: IMedicine[]) => [...prev, ...data]);
      if (data.length < 10) setHasMore(false);
      setLoading(false);
    } catch (err) {
      setError(err as string);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore]);

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
        <div key={medicine?.id} className="w-[45vw] lg:w-[15vw] lg:m-2">
          <MedicineCard medicine={medicine} />
        </div>
      ))}
      <div ref={loader}></div>
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
