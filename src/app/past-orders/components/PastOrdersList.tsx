'use client';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { getPastOrders } from '@/services/getPastOrders';
import { IPastOrder } from '@/interfaces/IPastOrder';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';

type PastOrdersListProps = {
  children?: string;
};

const PastOrdersList: React.FC<PastOrdersListProps> = () => {
  const [orders, setOrders] = useState<IPastOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const pageToLoad = 1;
    setLoading(true);
    setError('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    getPastOrders(pageToLoad)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        let list: IPastOrder[] = [];
        if (Array.isArray(payload)) list = payload as IPastOrder[];
        else if (Array.isArray(payload?.data)) list = payload.data as IPastOrder[];
        else if (Array.isArray(payload?.orders)) list = payload.orders as IPastOrder[];
        else list = [];
        setOrders(list);
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unknown error');
        setOrders([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full mt-4 ">
      <h2 className="font-poppins text-2xl mb-2 font-bold">Orders</h2>
      <Box className="">
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="list-item" className="mb-2" />
            ))}
          </div>
        )}
        {!loading && error && (
          <p className="font-poppins text-red-600">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="font-poppins text-gray-600">No orders yet.</p>
        )}

        {!loading && !error &&
          orders.map((item) => {
            return (
              <Link key={item._id} href={`/past-orders/order/${item._id}`}>
                <Flex
                  align={'center'}
                  width={'full'}
                  justify={'between'}
                  className="border-2 p-2 rounded-md mb-2 shadow-md"
                >
                  <Flex>
                    <Image
                      src={
                        'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1727873184/medicine_883407_jolgrg.png'
                      }
                      width={50}
                      height={50}
                      alt="cart-item"
                      className="w-auto h-fit"
                    ></Image>
                    <div className="ml-2">
                      <p className="font-poppins font-bold">Pharmacy</p>
                      <p className="font-poppins">
                        {item?.medicine_name}
                      </p>
                    </div>
                  </Flex>

                  <div className=" rounded-full bg-[#283b77] lg:py-0.5 lg:px-2.5 px-1 border border-transparent text-base text-white font-poppins transition-all shadow-lg text-center">
                    {item?.status}
                  </div>
                </Flex>
              </Link>
            );
          })}
      </Box>
    </div>
  );
};
export default PastOrdersList;
