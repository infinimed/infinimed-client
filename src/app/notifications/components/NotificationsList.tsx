'use client';
import { Flex, Grid } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNotifications } from '@/services/getNotifications';
import { INotificationBody } from '@/interfaces/INotificationBody';
import Skeleton from '@/components/Skeleton';

type PastOrdersListProps = {
  children?: string;
};

const PastAppointmentsList: React.FC<PastOrdersListProps> = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    getNotifications()
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setNotifications(res);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, []);

  return (
    <div className="w-full mt-4">
      <Grid className="w-full grid-cols-2">
        {error && <p className="col-span-2 text-red-600 font-poppins">Faced a server error. Please refresh</p>}
        {loading && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-32 mb-2" />
            ))}
          </>
        )}

        {!loading && notifications.length > 0 &&
          Object.values(notifications).map((notificationJSON: string) => {
            const item: INotificationBody = JSON.parse(notificationJSON);
            const dateTime = new Date(item?.createdAt);
            return (
              <Link
                key={item?.id}
                href={`/past-orders/appointment/${item?.payload.id}?notification_body=${notificationJSON}`}
                className="w-fit"
              >
                <Flex
                  align={'center'}
                  justify={'between'}
                  className="border-2 p-4 rounded-md mb-2 shadow-md"
                >
                  <>
                    <Flex className="items-center">
                      <div className="ml-2">
                        <p className="font-poppins font-bold mb-3">
                          {item?.message.split('-')[0]}
                        </p>
                        <p className="rounded-full bg-[#283b77] lg:py-0.5 lg:px-2.5 px-1 border border-transparent text-base text-white font-poppins transition-all shadow-lg w-fit mb-3">
                          {item?.message.split('-')[1]}
                        </p>
                        <p className="flex font-poppins justify-end text-sm text-gray-400">
                          {dateTime.toLocaleString('en-GB')}
                          <br />
                        </p>
                      </div>
                    </Flex>
                  </>
                </Flex>
              </Link>
            );
          })}
        {notifications.length === 0 && !loading && (
          <h2 className="font-poppins text-2xl mb-2 font-bold">
            You are all caught up!
          </h2>
        )}
      </Grid>
    </div>
  );
};
export default PastAppointmentsList;
