'use client';
// import { ICart } from '@/interfaces/ICart';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import React from 'react';
import Counter from './Counter';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { IMedicine } from '@/interfaces/IMedicine';
import { IAppointment } from '@/interfaces/IAppointment';
import { addToCart } from '@/lib/features/cart/addToCart';

type MedicineCartItem = IMedicine & {
  id: string;
  quantity: number;
  type: 'medicine';
  cartKey?: string;
};

type AppointmentCartItem = IAppointment & {
  id: string;
  quantity: number;
  type: 'appointment';
  cartKey?: string;
};

type CartItem = MedicineCartItem | AppointmentCartItem;

type OrderItemListProps = {
  children?: string;
};

const OrderItemList: React.FC<OrderItemListProps> = () => {
  const cart = useAppSelector((state) => state.addToCart.items) as Record<
    string,
    CartItem
  >;
  const dispatch = useAppDispatch();

  return (
    <div className="w-full mt-4 ">
      <Box className="">
        {Object.values(cart).map((item: CartItem) => {
          if (item.type === 'medicine') {
            return (
              <Flex
                align={'center'}
                width={'full'}
                justify={'between'}
                className="border-2 p-2 rounded-md mb-2 shadow-md"
                key={item.cartKey ?? item.id}
              >
                <Flex>
                  <Image
                    src={
                      (item as IMedicine).image ||
                      'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1727873184/medicine_883407_jolgrg.png'
                    }
                    width={50}
                    height={50}
                    alt="cart-item"
                    style={{ objectFit: 'contain' }}
                  ></Image>
                  <div className="ml-2">
                    <p className="font-poppins">
                      {(item as IMedicine).generic.name}
                    </p>
                    <p className="font-poppins">
                      {(item as IMedicine).name},{(item as IMedicine).brand}
                    </p>
                    <p className="font-poppins text-sm text-gray-500">
                      Unit price: {Number(item.price).toFixed(2)}Tk
                    </p>
                  </div>
                </Flex>
                <Counter
                  quantity={item.quantity}
                  increment={() =>
                    dispatch(
                      addToCart({
                        ...item,
                        id: item.id,
                        quantity: 1,
                        type: 'medicine',
                      } as MedicineCartItem),
                    )
                  }
                  decrement={() =>
                    dispatch(
                      addToCart({
                        ...item,
                        id: item.id,
                        quantity: -1,
                        type: 'medicine',
                      } as MedicineCartItem),
                    )
                  }
                />
              </Flex>
            );
          }
          if (item.type === 'appointment') {
            return (
              <Flex
                align={'center'}
                width={'full'}
                justify={'between'}
                className="border-2 p-2 rounded-md mb-2 shadow-md"
                key={item.cartKey ?? item.id}
              >
                <Flex>
                  <Image
                    src={
                      'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1740306044/appointment_qrpcom.png'
                    }
                    width={100}
                    height={100}
                    alt="cart-item"
                    style={{ objectFit: 'contain' }}
                  ></Image>
                  <div className="ml-2">
                    <p className="font-poppins font-semibold">
                      {(item as IAppointment).category_name || 'Category'}
                    </p>
                    <p className="font-poppins">
                      {(item as IAppointment).sub_category_name ||
                        'Sub Category'}
                    </p>
                    <p className="font-poppins">
                      {(item as IAppointment).service_name}
                    </p>
                    <p className="font-poppins">
                      {(item as IAppointment).time_frame.date}
                    </p>
                    <p className="font-poppins">
                      between {(item as IAppointment).time_frame.start_time}-
                      {(item as IAppointment).time_frame.end_time}
                    </p>
                    <p className="font-poppins text-sm text-gray-500">
                      Unit price: {Number(item.price).toFixed(2)}Tk
                    </p>
                  </div>
                </Flex>
                <div className="max-w-xs">
                  <Counter
                    quantity={item.quantity}
                    valuePrefix="days"
                    increment={() =>
                      dispatch(
                        addToCart({
                          ...(item as AppointmentCartItem),
                          id: item.id,
                          cartKey: item.cartKey,
                          quantity: 1,
                          type: 'appointment',
                        } as AppointmentCartItem),
                      )
                    }
                    decrement={() =>
                      dispatch(
                        addToCart({
                          ...(item as AppointmentCartItem),
                          id: item.id,
                          cartKey: item.cartKey,
                          quantity: -1,
                          type: 'appointment',
                        } as AppointmentCartItem),
                      )
                    }
                  />
                </div>
              </Flex>
            );
          }
        })}
      </Box>
      <Box className="mt-5 mb-5">
        <Flex justify={'between'} className="mb-2">
          {' '}
          <p className="font-poppins font-bold text-gray-400">Summary</p>
          <p className="font-poppins font-bold ">
            {Object.values(cart)
              .reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
              .toFixed(2)}
            Tk
          </p>
        </Flex>
        {/* <Flex
          justify={'between'}
          className="border-b-2 border-black border-dotted pb-5"
        >
          {' '}
          <p className="font-poppins font-bold text-gray-400">Delivery Fee</p>
          <p className="font-poppins font-bold">{(30).toFixed(2)}Tk</p>
        </Flex> */}
        <Flex
          justify={'between'}
          className="border-b-2 border-black border-dotted pb-5"
        >
          {' '}
          <p className="font-poppins font-bold text-gray-400">Platform fee</p>
          <p className="font-poppins font-bold">{30}Tk</p>
        </Flex>
        <Flex
          justify={'between'}
          className="border-b-2 border-black border-dotted pb-5"
        >
          {' '}
          <p className="font-poppins font-bold text-gray-400">Vat (15%)</p>
          <p className="font-poppins font-bold">
            {(
              Object.values(cart).reduce(
                (acc, curr) => acc + curr.quantity * curr.price,
                0,
              ) * 0.15
            ).toFixed(2)}
            Tk
          </p>
        </Flex>
        <Flex justify={'between'} className="mt-5">
          {' '}
          <p className="font-poppins font-bold text-gray-400">Total</p>
          <p className="font-poppins font-bold">
            {(
              Object.values(cart).reduce(
                (acc, curr) => acc + curr.quantity * curr.price,
                0,
              ) *
                1.15 +
              30
            ).toFixed(2)}{' '}
            Tk
          </p>
        </Flex>
      </Box>
    </div>
  );
};
export default OrderItemList;
