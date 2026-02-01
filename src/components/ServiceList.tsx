'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { Flex, Box, Text } from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { config } from '@/config';
import Skeleton from './Skeleton';
import { useNavigationLoader } from './NavigationLoaderProvider';

type IServiceListProps = {
  data?: ReactNode;
};

type IService = {
  _id: number;
  icon: string;
  name: string;
  decription: string;
};

const ServiceList: React.FC<IServiceListProps> = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { start: startNavigation } = useNavigationLoader();

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          `${config.backendURL}/api/service/category/`,
        );
        const data = await response.json();
        setServices(data.serviceCategories);
        setLoading(false);
      } catch (error) {
        setError(error as string);
      }
    }
    fetchServices();
  }, []);

  return (
    <Box className="w-full sm:w-1/3 lg:w-[70vw] mt-3">
      <Label className="font-poppins text-xl font-bold">
        {services.length > 0 && 'Services'}
      </Label>
      <Flex
        justify={'between'}
        className="w-full flex-wrap no-scrollbar justify-between mt-3 gap-y-3"
      >
        {loading &&
          new Array(6)
            .fill(0)
            .map((item) => (
              <Skeleton
                key={item}
                className="w-[30vw] lg:w-[11vw] h-[30vw] lg:h-[11vw]"
              />
            ))}
        {error && (
          <>
            <p>Server Error please try again</p>
          </>
        )}
        {services?.map((service: IService) => (
          <Link
            key={service._id}
            href={
              service.name.includes('Pharmacy')
                ? '/pharmacy'
                : `/issue/services/${service.name.split(' ').join('-')}?_id=${service._id}`
            }
            onClick={() => startNavigation()}
          >
            <Box className="w-fit sm:w-[33vw] lg:w-[11vw] " key={service._id}>
              <Flex className="w-[28vw] lg:w-full h-fit flex-col items-center">
                <Image
                  width={150}
                  height={150}
                  className="w-full h-auto rounded-2xl bg-white shadow-lg"
                  alt="service"
                  src={service.icon}
                />
                <Flex
                  justify={'center'}
                  className="w-full justify-center mt-2 font-bold"
                >
                  <Text
                    as="p"
                    className="text-black text-base font-poppins text-center"
                  >
                    {service.name}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

export default ServiceList;
