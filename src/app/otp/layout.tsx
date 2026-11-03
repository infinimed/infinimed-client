import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { IoIosArrowBack } from 'react-icons/io';
import NavbarTop from '@/components/desktop/NavbarTop';
import SideNavbar from '@/components/desktop/SideNavbar';
import Topbar from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'Verify Phone',
  description: 'Enter your verification code',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarTop></NavbarTop>

      <div className="hidden lg:block w-[20vw] fixed top-[66px] bottom-0 border-gray-300 border-r-[1px] bg-white overflow-y-auto">
        <SideNavbar></SideNavbar>
      </div>
      <div className="lg:w-[70vw] lg:ml-[25vw] lg:mt-[50px]">
        <div className="relative flex flex-col items-center">
          <div className="w-full lg:hidden">
            <Topbar
              title="Verify Phone"
              leftIcon={<IoIosArrowBack fontSize={'24px'} />}
            ></Topbar>
          </div>
          <>{children}</>
        </div>
      </div>
    </>
  );
}
