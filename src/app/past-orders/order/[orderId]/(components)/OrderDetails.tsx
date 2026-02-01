'use client';
import Timeline from '@/components/Timeline';
import { IOrderDetails } from '@/interfaces/IOrderItem';

import { getOrder } from '@/services/getOrder';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import loader from '@/assets/loader.svg';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Check,
  Clock,
  // X
  AlertCircle,
  LucideProps,
} from 'lucide-react';
import { Status } from '@/app/issue/past-issue/appointment/[apptId]/(components)/ApppointmentDetails';
import { updateOrder } from '@/services/updateOrder';

type DetailsProps = object;

export type IGetOrderStatusInfo = (status: IStatusOrder | Status) => {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  bg: string;
};

export type IStatusOrder =
  | 'Order Placed'
  | 'Out for Procurement'
  | 'Procured'
  | 'Delivery Initiated'
  | 'Rider Found'
  | 'Picked Up'
  | 'Enroute'
  | 'Delivered'
  | 'Returned'
  | 'Cancelled';

const mainStatuses = [
  'Order Placed',
  'Out for Procurement',
  'Procured',
  'Delivery Initiated',
  'Rider Found',
  'Picked Up',
  'Enroute',
  'Delivered',
];

const finalStatuses = ['Delivered', 'Returned', 'Cancelled'];

const OrderDetails: React.FC<DetailsProps> = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrderDetails>();
  const [cancellationPrompt, setCancellationPrompt] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingYes, setLoadingYes] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(orderId as string)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setOrder(res);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, [orderId]);

  const getStatusInfo = (status: IStatusOrder) => {
    switch (status) {
      case 'Order Placed':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100' };
      case 'Out for Procurement':
        return { icon: Check, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'Procured':
        return { icon: Check, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'Delivery Initiated':
        return { icon: Check, color: 'text-green-500', bg: 'bg-green-100' };
      case 'Rider Found':
        return { icon: Check, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Picked Up':
        return { icon: Check, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Enroute':
        return { icon: Check, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Delivered':
        return { icon: Check, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Cancelled':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' };
    }
  };

  function handleCancelOrder() {
    setCancellationPrompt(true);
  }

  function handleYes() {
    setLoadingYes(true);
    updateOrder(orderId as string, {
      status: 'Cancelled',
    })
      .then((res) => res.json())
      .then((res) => {
        setLoadingYes(false);
        console.log(res);
      })
      .catch((e) => {
        setLoadingYes(false);
        setError(e);
      });
  }

  function handleNo() {
    setCancellationPrompt(false);
  }

  return (
    <>
      {error && <p>Faced a server error. Please refresh</p>}
      {loading && <p>Fetching Order</p>}
      {!loading && order?._id && (
        <Flex className="flex-col lg:flex-row">
          <Flex
            align={'center'}
            width={'full'}
            justify={'between'}
            className=" p-2 rounded-md mb-2 shadow-md font-poppins  border-[#283891] border-solid border-2 h-fit"
          >
            <Flex direction={'column'} className="ml-2 w-[90vw] lg:w-[30vw]">
              <p className="font-bold">Cart Items</p>
              <div className="">
                {order?.cart_id.cartItems.map((cartItem) => {
                  const medicine =
                    cartItem.medicine_id &&
                    typeof cartItem.medicine_id !== 'string'
                      ? cartItem.medicine_id
                      : null;
                  const medicineKey =
                    typeof cartItem.medicine_id === 'string'
                      ? cartItem.medicine_id
                      : medicine?._id ?? cartItem._id;

                  return (
                    <div
                      key={medicineKey}
                      className="flex items-center border-b-[1px] border-gray-400 mt-3"
                    >
                    <Image
                      width={70}
                      height={70}
                      src={
                        'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1727873184/medicine_883407_jolgrg.png'
                      }
                      alt="medicine"
                    />
                    <Box>
                      <p>
                        <span className="text-gray-500 font-bold">
                          Generic{' '}
                        </span>{' '}
                        {medicine?.name ?? 'Unknown'}
                      </p>

                      <p>
                        <span className="text-gray-500 font-bold">Brand </span>
                        {medicine?.brand ?? 'Unknown'}
                      </p>

                      <p>
                        <span className="text-gray-500 font-bold">
                          Quantity{' '}
                        </span>
                        {cartItem.quantity}
                      </p>
                    </Box>
                    </div>
                  );
                })}
              </div>
            </Flex>
          </Flex>
          <Timeline
            currentStatus={order?.status as IStatusOrder}
            getStatusInfo={getStatusInfo as IGetOrderStatusInfo}
            mainStatuses={mainStatuses}
            finalStatuses={finalStatuses}
          ></Timeline>
        </Flex>
      )}
      {order?.status === 'Order Placed' && !cancellationPrompt && (
        <Box className="pb-[10vh]">
          <Box
            onClick={handleCancelOrder}
            className="w-[96vw] lg:w-[40vw] m-2 bg-red-900 text-white font-poppins font-bold text-xl p-3 text-center rounded-md cursor-pointer"
          >
            Cancel Order
          </Box>
        </Box>
      )}
      {cancellationPrompt && (
        <Flex
          direction={'column'}
          className="pb-[10vh] w-[96vw]  lg:w-[40vw] items-center"
        >
          <p className="font-bold text-xl">
            Are you sure you want to cancel this order?
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
    </>
  );
};
export default OrderDetails;
