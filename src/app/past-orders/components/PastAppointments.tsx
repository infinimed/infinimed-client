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
  const [appointments, setAppointments] = useState<IPastAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    getPastAppointments(1)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch appointments: ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        let list: IPastAppointment[] = [];
        if (Array.isArray(payload)) list = payload as IPastAppointment[];
        else if (Array.isArray(payload?.data)) list = payload.data as IPastAppointment[];
        else if (Array.isArray(payload?.appointments)) list = payload.appointments as IPastAppointment[];
        else list = Object.values(payload ?? {}) as IPastAppointment[];
        setAppointments(list);
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unknown error');
        setAppointments([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full mt-4 ">
      <h2 className="font-poppins text-2xl mb-2 font-bold">Appointments</h2>
      <Box className="">
        {loading && <p className="font-poppins">Loading appointments…</p>}
        {!loading && error && (
          <p className="font-poppins text-red-600">{error}</p>
        )}
        {!loading && !error && appointments.length === 0 && (
          <p className="font-poppins text-gray-600">No appointments yet.</p>
        )}

        {!loading && !error && appointments.map((item: IPastAppointment) => {
          return (
            <Link
              key={item?._id}
              href={`/past-orders/appointment/${item?._id}`}
            >
              <Flex
                align={'center'}
                width={'full'}
                justify={'between'}
                className="border-2 p-2 rounded-md mb-2 shadow-md"
              >
                <Flex className="items-center">
                  <Image
                    src={
                      'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1740306044/appointment_qrpcom.png'
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
                        Appointment Date
                      </span>{' '}
                      {new Date(
                        item?.time_frame?.start_time,
                      ).toLocaleDateString('en-GB')}
                      <br />
                      <span className="text-gray-700 font-bold">
                        Timeframe
                      </span>{' '}
                      {format(
                        new Date(item?.time_frame?.start_time),
                        'hh:mm a',
                      )}{' '}
                      -{' '}
                      {format(new Date(item?.time_frame?.end_time), 'hh:mm a')}
                    </p>
                  </div>
                </Flex>

                <div className="rounded-full bg-[#283b77] lg:py-0.5 lg:px-2.5 px-1 border border-transparent text-base text-white font-poppins transition-all shadow-lg text-center">
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
export default PastAppointmentsList;
