'use client';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPastAppointments } from '@/services/getPastAppointments';
import { IPastAppointment } from '@/interfaces/IPastAppointments';
import { format } from 'date-fns';

type PastOrdersListProps = {
  children?: string;
};

const PastAppointmentsList: React.FC<PastOrdersListProps> = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
    getPastAppointments(page)
      .then((res) => res.json())
      .then((res) => {
        setOrders(res);
      });
  }, []);

  return (
    <div className="w-full mt-4 ">
      <h2 className="font-poppins text-2xl mb-2 font-bold">Appointments</h2>
      <Box className="">
        {Object.values(orders).map((item: IPastAppointment) => {
          return (
            <Link key={item._id} href={`/past-orders/${item._id}`}>
              <Flex
                align={'center'}
                width={'full'}
                justify={'between'}
                className="border-2 p-2 rounded-md mb-2 shadow-md"
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
                      {item.issue_id.service_id.name}
                    </p>
                    <p className="font-poppins">
                      <span className="text-gray-700 font-bold">
                        Appointment Date
                      </span>{' '}
                      {new Date(
                        item.time_frame.start_time,
                      ).toLocaleDateString()}
                      <br />
                      <span className="text-gray-700 font-bold">
                        Timeframe
                      </span>{' '}
                      {format(new Date(item.time_frame.start_time), 'hh:mm a')}{' '}
                      - {format(new Date(item.time_frame.end_time), 'hh:mm a')}
                    </p>
                  </div>
                </Flex>

                <div className="rounded-full bg-[#283b77] lg:py-0.5 lg:px-2.5 px-1 border border-transparent text-base text-white font-poppins transition-all shadow-lg ">
                  {item.status}
                </div>
              </Flex>
            </Link>
          );
        })}
      </Box>
    </div>
  );
};
export default PastAppointmentsList;
