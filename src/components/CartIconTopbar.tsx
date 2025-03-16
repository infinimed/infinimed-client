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
          width={'70'}
          height={'70'}
          className="h-12 w-auto"
          src={
            'https://res.cloudinary.com/dgayarw1f/image/upload/v1742114433/Cart_01_q8e3lq.png'
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
