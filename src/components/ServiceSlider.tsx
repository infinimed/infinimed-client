import { Box, Flex, Text } from '@radix-ui/themes';
import React from 'react';
import * as subServiceList from '@/data/service.json';
// import { ISubservice } from '@/interfaces/ISubservice';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';
import Image from 'next/image';

type ServiceSliderProps = {
  serviceSlug: string;
};

type Service = {
  id: number;
  subserviceName: string;
  image: string;
  url?: string;
};

type feed = {
  'doctor-consultation': Service[];
  'health-at-home': Service[];
  'tests-at-home': Service[];
  'phisiotherapy-at-home': Service[];
  'nurses-at-home': Service[];
};

const ServiceSlider: React.FC<ServiceSliderProps> = ({ serviceSlug }) => {
  const data: feed = subServiceList;

  return (
    <Flex
      justify={'start'}
      align={'start'}
      className="w-full overflow-scroll no-scrollbar mt-3 h-full"
    >
      {data[serviceSlug as keyof feed] &&
        data[serviceSlug as keyof feed].slice(0, 4).map((service: Service) => (
          <Box
            className="w-[45vw] sm:w-[33vw] lg:w-[22vw] ml-3 mt-3 drop-shadow-lg"
            key={service.id}
          >
            <Link href={`/issue/service/${service?.url}`}>
              <Flex
                direction={'column'}
                className="w-[45vw] lg:w-full h-fit justify-start items-end relative"
              >
                <Image
                  width={200}
                  height={200}
                  className="w-[45vw] lg:w-full h-auto rounded-lg"
                  alt="service"
                  src={service.image as string}
                />
                <Flex
                  justify={'between'}
                  className="flex w-[45vw] lg:w-full pb-6 text-start justify-between items-center mt-3 pl-2 pr-2"
                >
                  <Text
                    as="p"
                    weight={'bold'}
                    className="text-black text-md font-poppins w-full"
                  >
                    {service.subserviceName}
                  </Text>
                  {/* <Button className="w-1/3 rounded-full">+</Button> */}
                </Flex>
              </Flex>
            </Link>
          </Box>
        ))}
      <div className=" w-[45vw] lg:w-fit sm:w-[33vw] mr-3 mt-3 drop-shadow-lg h-full lg:hidden">
        <Link href={(serviceSlug || '') as Url}>
          <Flex
            direction={'column'}
            className="w-[45vw] lg:w-fit h-full justify-center items-center relative"
          >
            <p className="font-poppins font-semibold text-danger text-2xl lg:w-0 ">
              See More
            </p>
          </Flex>
        </Link>
      </div>
    </Flex>
  );
};
export default ServiceSlider;
