// import CartButton from '@/components/CartButton';
import Topbar from '@/components/Topbar';

import { ReactNode } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import CartIconTopbar from '@/components/CartIconTopbar';
import NavbarTop from '@/components/desktop/NavbarTop';
import SideNavbar from '@/components/desktop/SideNavbar';
// import SearchBarSpecific from '@/components/SearchBarSpecific';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarTop></NavbarTop>

      <div className="hidden lg:block w-[20vw] fixed h-full border-gray-300 border-r-[1px]">
        <SideNavbar></SideNavbar>
      </div>
      {/* <SearchBarSpecific purpose="medicine" /> */}
      <div className="lg:w-[70vw] lg:ml-[25vw] lg:mt-[50px]">
        <div className="relative h-screen lg:h-full flex flex-col items-center">
          <div className="lg:hidden">
            <Topbar
              title="Profile"
              leftIcon={<IoIosArrowBack fontSize={'24px'} />}
              rightIcon={<CartIconTopbar></CartIconTopbar>}
            ></Topbar>
          </div>
          {/* <SearchBarSpecific purpose="medicine" /> */}
          <>{children}</>
          {/* <CartButton></CartButton> */}
        </div>
      </div>
    </>
  );
}
