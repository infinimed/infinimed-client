'use client';
import Timeline from '@/components/Timeline';
import { IAppointmentDetails } from '@/interfaces/IAppointment';
import { getAppointment } from '@/services/getAppointment';
import { Box, Flex } from '@radix-ui/themes';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { IGetStatusInfo } from '@/app/issue/past-issue/appointment/[apptId]/(components)/ApppointmentDetails';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { popNotification } from '@/services/getNotifications';
import { updateAppointment } from '@/services/updateAppointment';
import loader from '@/assets/loader.svg';
import ImageDetails from './ImageDetails';

type DetailsProps = object;

type Status =
  | 'Pending'
  | 'Fixed Provider and Time'
  | 'Service Provider Reached'
  | 'Patient Served'
  | 'Provider Declined'
  | 'Client Declined'
  | 'Cancelled';

const mainStatuses = [
  'Pending',
  'Fixed Provider and Time',
  'Service Provider Reached',
];

const finalStatuses = [
  'Patient Served',
  'Provider Declined',
  'Client Declined',
  'Cancelled',
];

const AppointmentDetails: React.FC<DetailsProps> = () => {
  const { apptId } = useParams();
  const searchParams = useSearchParams();
  const [appointment, setAppointment] = useState<IAppointmentDetails>();
  const [cancellationPrompt, setCancellationPrompt] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingYes, setLoadingYes] = useState(false);
  const [error, setError] = useState('');
  const [expandPhotos, setExpandPhotos] = useState(false);
  // const router = useRouter();

  const notification_body = searchParams.get('notification_body');

  useEffect(() => {
    getAppointment(apptId as string)
      .then((res) => res.json())
      .then((res) => {
        setAppointment(res);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, []);

  useEffect(() => {
    if (notification_body) {
      popNotification(notification_body as string)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          setError(
            `Notification server Error: ${e}. Please click on the notification again to make it vanish`,
          );
        });
    }
  }, [notification_body]);

  const getStatusInfo = (status: Status) => {
    switch (status) {
      case 'Pending':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100' };
      case 'Fixed Provider and Time':
        return { icon: Check, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'Service Provider Reached':
        return { icon: Check, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'Patient Served':
        return { icon: Check, color: 'text-green-500', bg: 'bg-green-100' };
      case 'Provider Declined':
        return { icon: X, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Client Declined':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Cancelled':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' };
    }
  };

  function handleCancel() {
    setCancellationPrompt(true);
  }

  function handleYes() {
    setLoadingYes(true);

    setError('');
    updateAppointment(apptId as string, {
      status: 'Cancelled',
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setLoadingYes(false);
        setCancellationPrompt(false);
        setAppointment((prev) => {
          return Object.assign({ ...prev }, {
            status: 'Cancelled',
          } as IAppointmentDetails);
        });
      })
      .catch((e) => {
        console.log(e);
        setLoadingYes(false);
        setError(`Server Error: ${e}. Please try to Cancel Again`);
      });
  }

  function handleNo() {
    setCancellationPrompt(false);
  }

  function handleExpand() {
    setExpandPhotos((prev) => !prev);
  }

  return (
    <>
      {error && <p>Faced a server error. Please refresh</p>}
      {loading && <p>Fetching Appointment</p>}

      {appointment?._id && (
        <Flex className="lg:flex-row flex-col lg:items-start">
          <Flex
            align={'center'}
            direction={'column'}
            justify={'between'}
            className="mt-[5vh] p-2 rounded-md shadow-md  mb-[5vh] border-[#283891] border-solid border-2 w-[90vw] lg:w-[30vw]"
          >
            <Flex className="items-center w-full">
              <div className="ml-2">
                <p className="font-poppins font-bold text-2xl">
                  {appointment?.issue_id?.service_id?.sub_category?.name} -{' '}
                  {appointment?.issue_id?.service_id?.name}
                </p>
                <p className="font-poppins mt-2">
                  <span className="text-gray-700 font-bold">
                    Appointment Date
                  </span>{' '}
                  {appointment?.time_frame &&
                    new Date(
                      appointment?.time_frame?.start_time as string,
                    ).toLocaleDateString('en-GB')}
                  <br />
                  <span className="text-gray-700 font-bold">
                    Timeframe
                  </span>{' '}
                  {appointment?.time_frame &&
                    format(
                      new Date(appointment?.time_frame?.start_time as string),
                      'hh:mm a',
                    )}{' '}
                  -{' '}
                  {appointment?.time_frame &&
                    format(
                      new Date(appointment?.time_frame?.end_time as string),
                      'hh:mm a',
                    )}
                </p>
              </div>
            </Flex>
            <Flex
              align={'start'}
              className="p-2 ml-4 font-poppins font-bold w-[90vw] lg:w-[30vw]"
            >
              {appointment?.issue_id?.assets &&
              appointment?.issue_id?.assets?.length > 0
                ? 'Investigation documents'
                : ''}
            </Flex>
            <Flex align={'center'} className="p-2 ml-2 w-[90vw] lg:w-[30vw]">
              {appointment?.issue_id?.assets
                ?.slice(0, 3)
                .map((asset) => (
                  <Image
                    key={asset}
                    src={asset}
                    height={50}
                    width={50}
                    alt="service-asset"
                    className="m-2"
                  />
                ))}
              {appointment.issue_id.assets.length > 0 && (
                <div onClick={handleExpand}>Expand</div>
              )}
            </Flex>
            {expandPhotos && (
              <div className="lg:hidden block">
                {appointment?.issue_id?.assets
                  ?.slice(0, 3)
                  .map((asset) => (
                    <Image
                      key={asset}
                      src={asset}
                      height={400}
                      width={400}
                      alt="service-asset"
                      className=" w-[94vw] mb-2"
                    />
                  ))}
              </div>
            )}
          </Flex>
          <Timeline
            currentStatus={appointment?.status as Status}
            getStatusInfo={getStatusInfo as IGetStatusInfo}
            mainStatuses={mainStatuses}
            finalStatuses={finalStatuses}
            statusDetails={
              appointment?.apt_time
                ? {
                    ['Fixed Provider and Time' as string]: format(
                      new Date(appointment?.apt_time as string),
                      'hh:mm a',
                    ) as string,
                  }
                : {
                    ['Fixed Provider and Time' as string]: '',
                  }
            }
          ></Timeline>
        </Flex>
      )}

      {appointment?._id &&
        appointment?.status === 'Pending' &&
        !cancellationPrompt && (
          <Box className="pb-[10vh]">
            <Box
              onClick={handleCancel}
              className="w-[96vw] lg:w-[40vw] m-2 bg-red-900 text-white font-poppins font-bold text-xl p-3 text-center rounded-md cursor-pointer"
            >
              Cancel Appointment
            </Box>
          </Box>
        )}
      {cancellationPrompt && (
        <Flex
          direction={'column'}
          className="pb-[10vh] w-[96vw]  lg:w-[40vw] items-center"
        >
          <p className="font-bold text-xl">
            Are you sure you want to cancel this appointment?
          </p>
          <Flex width={'100%'}>
            <Box
              onClick={handleYes}
              className="w-1/2 m-2 bg-indigo-900 text-white font-poppins font-bold text-xl p-3 text-center rounded-md cursor-pointer"
            >
              {loadingYes ? (
                <Image
                  className="w-[2rem] h-[2rem] text-white"
                  src={loader}
                  alt="loader"
                />
              ) : (
                'Yes'
              )}
            </Box>
            <Box
              onClick={handleNo}
              className="w-1/2 m-2 bg-red-900 text-white font-poppins font-bold text-xl p-3 text-center rounded-md cursor-pointer"
            >
              No
            </Box>
          </Flex>
        </Flex>
      )}

      {expandPhotos && (
        <>
          <ImageDetails
            assets={appointment?.issue_id?.assets as string[]}
            expandPhotos={expandPhotos}
            setExpandPhotos={setExpandPhotos}
          />
        </>
      )}
    </>
  );
};
export default AppointmentDetails;
