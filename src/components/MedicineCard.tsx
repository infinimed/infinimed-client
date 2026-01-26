'use client';
import React from 'react';
import { IMedicine } from '@/interfaces/IMedicine';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addToCart } from '@/lib/features/cart/addToCart';

type MedicineCardProps = {
  medicine: IMedicine & {
    _id: string;
    generic: {
      name: string;
    };
    name: string;
  };
};

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const dispatch = useAppDispatch();

  function handleAddToCart(quantityToAdd: number) {
    dispatch(
      addToCart({
        ...medicine,
        id: medicine._id,
        quantity: quantityToAdd,
        type: 'medicine',
      }),
    );
  }

  const cart = useAppSelector((state) => state.addToCart.items);

  return (
    <div className="w-[45vw] lg:w-[15vw] bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/medicine/${medicine?._id}`}>
        <Image
          width={300}
          height={300}
          className="w-full rounded-t-lg p-2 bg-gray-400"
          src={
            medicine.image ||
            'https://res.cloudinary.com/dsuiwxwkg/image/upload/v1727873184/medicine_883407_jolgrg.png'
          }
          alt="medicine image"
        />
      </Link>
      <div className="p-5 w-full bg-white">
        <Link href={`/medicine/${medicine?._id}`}>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {/* {medicine?.generic?.name} */}
            {medicine?.name} <br />
          </h5>

          <p className="mb-3 flex justify-between w-full font-normal text-gray-700 dark:text-gray-400">
            {' '}
            {medicine?.brand}
          </p>
          <p className="font-poppins font-bold text-xl mb-4">
            {medicine?.price}Tk
          </p>
        </Link>

        {cart[medicine._id]?.quantity ? (
          <div className="w-full inline-flex items-center justify-between">
            <div
              onClick={() => handleAddToCart(-1)}
              className="w-10 px-3 py-2 text-lg font-poppins text-center text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              -
            </div>
            <div className="text-lg font-poppins">
              {cart[medicine?._id as string]?.quantity}
            </div>

            <div
              onClick={() => handleAddToCart(1)}
              className="w-10 px-3 py-2 text-lg font-poppins text-center text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              +
            </div>
          </div>
        ) : (
          <div
            onClick={() => handleAddToCart(1)}
            className="w-full inline-flex items-center justify-center px-3 py-2 text-lg font-poppins text-center text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add
          </div>
        )}
      </div>
    </div>
  );
};
export default MedicineCard;
