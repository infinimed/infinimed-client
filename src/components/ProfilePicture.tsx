'use client';
import { IUser } from '@/interfaces/IUser';
import { useAppSelector } from '@/lib/hooks';
import { getUser } from '@/services/getUser';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type ProfilePictureProps = {
  children?: string;
};

const ProfilePicture: React.FC<ProfilePictureProps> = () => {
  const isLoggedIn = useAppSelector((state) => state.setIsLoggedIn);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    if (isLoggedIn) {
      getUser()
        .then((res) => res.json())
        .then((res) => setUser(res));
    }
  }, [isLoggedIn]);

  return (
    <div className="lg:w-[3vw] w-[8vw]">
      {' '}
      {isLoggedIn === true ? (
        <Link href={'/profile'}>
          <Image
            src={
              (user?.profile_picture?.toString() as string)?.includes('http')
                ? (user?.profile_picture?.toString() as string)
                : 'https://res.cloudinary.com/dgayarw1f/image/upload/v1745768387/Neomorphic_Icon_set_002-14_lwhw05.svg'
            }
            width={100}
            height={100}
            className="rounded-full w-full aspect-square object-cover border-solid border-2 shadow-md"
            alt=""
          ></Image>
          <p></p>
        </Link>
      ) : (
        <Link href={'/login'}>
          <Image
            src="https://res.cloudinary.com/dgayarw1f/image/upload/v1745768387/Neomorphic_Icon_set_002-14_lwhw05.svg"
            width={100}
            height={100}
            className="border-rounded rounded-full shadow-md"
            alt=""
          ></Image>
          <p></p>
        </Link>
      )}
    </div>
  );
};
export default ProfilePicture;
