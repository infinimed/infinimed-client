'use client';
import Timeline from '@/components/Timeline';
import { IOrderDetails } from '@/interfaces/IOrderItem';

import { getOrder } from '@/services/getOrder';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';

// import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Check, Clock, X, AlertCircle, LucideProps } from 'lucide-react';
import { Status } from '../../../appointment/[apptId]/(components)/ApppointmentDetails';

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

  useEffect(() => {
    getOrder(orderId as string)
      .then((res) => res.json())
      .then((res) => {
        setOrder(res);
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
        return { icon: X, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Picked Up':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Enroute':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Delivered':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' };
    }
  };

  return (
    <>
      <Flex
        align={'center'}
        width={'full'}
        justify={'between'}
        className="border-2 p-2 rounded-md mb-2 shadow-md font-poppins"
      >
        <Flex direction={'column'} className="ml-2 w-[90vw] lg:w-[40vw]">
          <p className="font-bold">Cart Items</p>
          <div className="">
            {order?.cart_id.cartItems.map((cartItem) => (
              <div
                key={cartItem.medicine_id._id}
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
                    <span className="text-gray-500 font-bold">Generic </span>{' '}
                    {cartItem.medicine_id.name}
                  </p>

                  <p>
                    <span className="text-gray-500 font-bold">Brand </span>
                    {cartItem.medicine_id.brand}
                  </p>

                  <p>
                    <span className="text-gray-500 font-bold">Quantity </span>
                    {cartItem.quantity}
                  </p>
                </Box>
              </div>
            ))}
          </div>
        </Flex>
      </Flex>
      <Timeline
        currentStatus={order?.status as IStatusOrder}
        getStatusInfo={getStatusInfo as IGetOrderStatusInfo}
        mainStatuses={mainStatuses}
        finalStatuses={finalStatuses}
      ></Timeline>
    </>
  );
};
export default OrderDetails;
