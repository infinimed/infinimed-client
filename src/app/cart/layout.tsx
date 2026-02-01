'use client';
import NavbarTop from '@/components/desktop/NavbarTop';
import SideNavbar from '@/components/desktop/SideNavbar';
import Topbar from '@/components/Topbar';
import { useAppSelector } from '@/lib/hooks';

import { changeOrderFormat } from '@/lib/utils/changeOrderFormat.processing';
import { createOrder } from '@/services/createOrder';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import loader from '@/assets/loader.svg';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const isLoggedIn = useAppSelector((state) => state.setIsLoggedIn);
  const cart = useAppSelector((state) => state.addToCart);
  const area = useAppSelector((state) => state.area);

  function handleOrderMore() {
    router.push('/');
  }
  async function handlePlaceOrder() {
    if (!isLoggedIn) {
      router.push('/login?from_cart=true');
      return;
    }
    if (!area?.detail || !area?.geocode?.lat || !area?.geocode?.long) {
      setError('Please select a delivery area before placing your order');
      router.push('/add-area');
      return;
    }
    setLoading(true);
    setError(undefined);
    const processedOrderItems = changeOrderFormat(cart, {
      detail: area.detail,
      lat: area.geocode.lat,
      long: area.geocode.long,
    });
    try {
      const response = await createOrder(processedOrderItems);
      const order = await response.json();
      router.push(`/order-success?order_id = ${order._id}`);
    } catch (error) {
      setLoading(false);
      setError(`Server Error : ${error}. Please try again`);
    }
  }
  return (
    <>
      <NavbarTop></NavbarTop>

      <div className="hidden lg:block w-[20vw] fixed h-full border-gray-300 border-r-[1px]">
        <SideNavbar></SideNavbar>
      </div>
      <div className="lg:w-[70vw] lg:ml-[25vw] lg:mt-[50px]">
        <div className="relative flex flex-col items-center">
          <Topbar
            title="Cart"
            leftIcon={<IoIosArrowBack fontSize={'24px'} />}
          ></Topbar>
          <>{children}</>
        </div>
        <Box className="pb-[10vh] lg:p-0">
          <Box
            onClick={() => router.push('add-area')}
            className="w-[96vw] lg:w-[35vw] m-2 lg:m-0 lg:mt-1 bg-white text-[#283b77] border-solid border-2 border-[#283b77] font-poppins font-bold text-xl p-3 text-center rounded-md mb-2"
          >
            Change Area
          </Box>
          <Box
            onClick={handleOrderMore}
            className="w-[96vw] lg:w-[35vw] m-2 lg:m-0 lg:mt-1 bg-white text-[#283b77] border-solid border-2 border-[#283b77] font-poppins font-bold text-xl p-3 text-center rounded-md mb-2"
          >
            Order more
          </Box>
          <div>{error}</div>
          <Flex
            onClick={handlePlaceOrder}
            justify={'center'}
            className="w-[96vw] lg:w-[35vw] lg:m-0 lg:mt-1 bg-[#283b77] text-white font-poppins font-bold text-xl p-3 text-center rounded-md cursor-pointer m-auto justify-center"
          >
            {loading ? (
              <Image
                className="w-[2rem] h-[2rem] text-white"
                src={loader}
                alt="loader"
              />
            ) : (
              <p>Place Order</p>
            )}
          </Flex>
        </Box>
      </div>
    </>
  );
}
