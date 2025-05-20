'use client';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import MedicineCard from './MedicineCard';
import { IMedicine } from '@/interfaces/IMedicine';
import { config } from '@/config';
import { useAppSelector } from '@/lib/hooks';

type MedicineListProps = {
  children?: ReactNode;
};

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

  async function fetchMedicines() {
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
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    fetchMedicines();
  }, [page]);

  return (
    <div className="flex flex-wrap w-[100vw] lg:w-full justify-evenly lg:justify-start gap-y-3 mt-3 pb-20">
      {error && <p>Faced a server error. Please refresh</p>}

      {(medicineSearchResults.length > 0
        ? (medicineSearchResults as (IMedicine & { _id: string })[])
        : (medicines as (IMedicine & { _id: string })[])
      )?.map((medicine: IMedicine & { _id: string }) => (
        <div key={medicine?.id} className="w-[45vw] lg:w-[15vw] lg:m-2">
          <MedicineCard medicine={medicine} />
        </div>
      ))}
      <div ref={loader}></div>
      {loading && <p>Fetching Medicines</p>}
    </div>
  );
};
export default MedicineList;
