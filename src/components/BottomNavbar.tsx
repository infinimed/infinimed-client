'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import FloatingCallButton from './FloatingCallButton';
import { useAppSelector } from '@/lib/hooks';
import { getUser } from '@/services/getUser';
import { IUser } from '@/interfaces/IUser';
import SunThroughWindowIcon from './SunThroughWindowIcon';
import { Flex } from '@radix-ui/themes';

type BottomNavbarProps = object;

const BottomNavbar: React.FC<BottomNavbarProps> = () => {
  // const cartItems = useAppSelector((state) => state.addToCart.items);
  const isLoggedIn = useAppSelector((state) => state.setIsLoggedIn);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    if (isLoggedIn) {
      console.log(user);
      getUser()
        .then((res) => res.json())
        .then((res) => setUser(res));
    }
  }, [isLoggedIn]);

  return (
    <>
  <FloatingCallButton phoneNumber="1234567890" />
  <Flex className="w-full" justify={'center'}>
    <nav className="bg-indigo-400/90 backdrop-blur-md shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)] h-14 w-[66%] max-w-sm rounded-full fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-between items-center lg:hidden px-4 py-2 border border-indigo-300/40">
      <div className="flex-1 flex justify-center">
            <Link href={'/offers'}>
              <Image
                src="https://res.cloudinary.com/dgayarw1f/image/upload/v1745768384/Neomorphic_Icon_set_002-09_zftwou.svg"
        width={40}
        height={40}
                alt=""
        className="rounded-full w-10 h-10 object-contain"
              ></Image>
              {/* </SunThroughWindowIcon> */}
              <p></p>
            </Link>
          </div>
      <div className="flex-1 flex justify-center">
            <Link href={'/'}>
              <SunThroughWindowIcon>
                <Image
                  src="https://res.cloudinary.com/dgayarw1f/image/upload/v1730292454/dvhuah5tzhgysxl2lxds.png"
      width={52}
      height={52}
                  alt=""
      className="w-12 h-12 object-contain"
        ></Image>
              </SunThroughWindowIcon>
            </Link>
          </div>
      <div className="flex-1 flex justify-center">
            <Link href="/past-orders">
              <Image
                src="https://res.cloudinary.com/american-international-university-bangladesh/image/upload/v1746971248/Neomorphic_Icon_set_002-06_gcdds7.svg"
        width={40}
        height={40}
        className="rounded-full w-10 h-10 object-contain"
                alt=""
              ></Image>

              <p></p>
            </Link>
          </div>
          {/* <div className="w-1/5 p-2 relative">
          <Link href={'/cart'}>
       
              <Image
                src="https://res.cloudinary.com/dgayarw1f/image/upload/v1742114433/Cart_01_q8e3lq.png"
                width={100}
                height={100}
                alt=""
              />
           
            <div className="absolute bottom-[-10px] right-[-2px] bg-white border-solid border-2 border-indigo-900 pl-[6px] pt-[1px] pb-[1px] pr-[6px] rounded-full mt-8 text-indigo-900 font-poppins">
              {' '}
              {Object.values(cartItems).reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.price * currentValue.quantity,
                0,
              )}
              Tk
            </div>
          </Link>
        </div> */}
          {/* <div className="w-1/5 p-5">
          {isLoggedIn ? (
            <Link href={'/profile'}>
              <SunThroughWindowIcon>
                <Image
                  src={
                    (user?.profile_picture?.toString() as string)?.includes(
                      'http',
                    )
                      ? (user?.profile_picture?.toString() as string)
                      : 'https://res.cloudinary.com/dgayarw1f/image/upload/v1730292455/pzmgg0mw21uvza1btsgm.png'
                  }
                  width={100}
                  height={100}
                  className="rounded-full w-full aspect-square object-cover"
                  alt=""
                ></Image>
              </SunThroughWindowIcon>
              <p></p>
            </Link>
          ) : (
            <Link href={'/login'}>
              <Image
                src="https://res.cloudinary.com/dgayarw1f/image/upload/v1730292455/pzmgg0mw21uvza1btsgm.png"
                width={100}
                height={100}
                className="border-rounded"
                alt=""
              ></Image>
              <p></p>
            </Link>
          )}
        </div> */}
  </nav>
      </Flex>
    </>
  );
};
export default BottomNavbar;
