import { Flex } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SelectArea from '../SelectArea';
import SearchBarSpecific from './SearchBarSpecific';
import NotificationIcon from '../NotificationIcon';
import CartIconTopbar from '../CartIconTopbar';
import ProfilePicture from '../ProfilePicture';

type NavbarTopProps = {
  children?: string;
};

const NavbarTop: React.FC<NavbarTopProps> = () => {
  return (
    <div className="hidden lg:block fixed top-0 left-0 w-full h-[66px] px-4 bg-white z-20 shadow-sm">
      <Flex className="h-full" justify={'between'} align={'center'}>
        <Link href={'/'}>
          <Image
            src="https://res.cloudinary.com/dgayarw1f/image/upload/v1730292454/dvhuah5tzhgysxl2lxds.png"
            width={50}
            height={50}
            className="ml-2"
            alt=""
          ></Image>
          <p></p>
        </Link>
        <p className="font-bold font-poppins">
          Hello,
          <br /> Welcome to IM Health
        </p>

        <SelectArea></SelectArea>

        <SearchBarSpecific></SearchBarSpecific>
  <Flex className="w-[12vw]" justify={'between'} align={'center'}>
          <NotificationIcon></NotificationIcon>
          <CartIconTopbar></CartIconTopbar>
          <ProfilePicture></ProfilePicture>
        </Flex>
      </Flex>
    </div>
  );
};
export default NavbarTop;
