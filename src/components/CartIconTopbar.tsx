'use client';
import Image from 'next/image';
import React from 'react';

import { useAppSelector } from '@/lib/hooks';
import Link from 'next/link';

type CartIconTopbarProps = object;

const CartIconTopbar: React.FC<CartIconTopbarProps> = () => {
  const cartItems = useAppSelector((state) => state.addToCart.items);
  return (
    <Link href={'/cart'}>
      <div className="relative">
        <Image
          width={'100'}
          height={'100'}
          className="h-12 w-auto shadow-lg rounded-full m-1"
          src={
            'https://res.cloudinary.com/american-international-university-bangladesh/image/upload/v1746971249/Neomorphic_Icon_set_002-12_o9guhx.svg'
          }
          alt="cart"
        />
        <div className="absolute bottom-[-15px] right-[15px] bg-white border-solid border-2 border-indigo-900 pl-[6px] pt-[1px] pb-[1px] pr-[6px] rounded-full mt-8 text-indigo-900 font-poppins">
          {' '}
          {Object.values(cartItems).reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.price * currentValue.quantity,
            0,
          )}
          Tk
        </div>
      </div>
    </Link>
  );
};
export default CartIconTopbar;
