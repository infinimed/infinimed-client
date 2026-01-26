'use client';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
// import { getPastAppointments } from '@/services/getPastAppointments';
// import { IPastAppointment } from '@/interfaces/IPastAppointments';
// import { format } from 'date-fns';
import { getUpcomingAppointment } from '@/services/getAppointment';
import { IUpcomingAppointment } from '@/interfaces/IAppointment';
import { useAppSelector } from '@/lib/hooks';

type PastOrdersListProps = {
  children?: string;
};

const UpcomingAppointment: React.FC<PastOrdersListProps> = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState();
  const isLoggedIn = useAppSelector((state) => state.setIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      getUpcomingAppointment()
        .then((res) => res.json())
        .then((res) => {
          setOrders(res);
        })
        .catch((e) => {
          setError(e);
        });
    }
  }, [isLoggedIn]);

  return (
    <div className="w-full mt-4 ">
      {error && <p>Failed to fetch Upcoming Appointment please try again</p>}
      <h2 className="font-poppins text-xl mb-2 font-bold">
        {orders.length > 0 && 'Upcoming Appointment'}
      </h2>
      <Box className="">
        {isLoggedIn &&
          Object.values(orders).map((item: IUpcomingAppointment) => {
            return (
              <Link
                key={item?._id}
                href={`/past-orders/appointment/${item?._id}`}
              >
                <Flex
                  align={'center'}
                  // width={'full'}
                  justify={'between'}
                  className="border-2 p-2 rounded-md mb-2 shadow-md lg:w-2/3 w-full"
                >
                  <Flex className="items-center">
                    <Image
                      src={
                        'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1727873184/medicine_883407_jolgrg.png'
                      }
                      className="lg:w-[5vw] w-auto h-fit"
                      width={50}
                      height={50}
                      alt="cart-item"
                    ></Image>
                    <div className="ml-2">
                      <p className="font-poppins font-bold">
                        {item?.issue_id?.service_id?.sub_category?.name}{' '}
                        {item?.issue_id?.service_id?.name}
                      </p>
                      <p className="font-poppins">
                        <span className="text-gray-700 font-bold">
                          Date and Time
                        </span>{' '}
                        <br />
                        {new Date(item?.apt_time).toLocaleString('en-GB')}
                        <br />
                      </p>
                    </div>
                  </Flex>

                  <div className="lg:block hidden rounded-full bg-[#283b77] lg:py-0.5 lg:px-2.5 py-0.5  px-2 pl-2 pr-2 border border-transparent text-base text-white font-poppins transition-all shadow-lg justify-center text-center">
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
export default UpcomingAppointment;
