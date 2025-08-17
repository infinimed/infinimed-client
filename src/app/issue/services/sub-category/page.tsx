'use client';

import Topbar from '@/components/Topbar';
import { IoIosArrowBack } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import { config } from '@/config';
import { ISubservice } from '@/interfaces/ISubservice';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import { useAppSelector } from '@/lib/hooks';

const RadioButtonList: React.FC = () => {
  const searchParams = useSearchParams();

  const sub_category_id = searchParams.get('sub_category_id');
  const searchResults = useAppSelector((state) => state.searchResults);

  const [options, setOptions] = useState([
    {
      value: '',
      label: '',
      banner_image: '',
      price: 0,
      sub_category_name: '',
      category_name: '',
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          `${config.backendURL}/api/service/${sub_category_id}`,
        );
        const data = await response.json();
        console.log(data);
        const mappedOptions = data.services.map((service: ISubservice & { sub_category: { name: string; category_id?: { name: string } } }) => ({
          label: service.name,
          value: service._id,
          banner_image: service.banner_image,
          price: service.price,
          sub_category_name: service?.sub_category?.name,
          category_name: service?.sub_category?.category_id?.name || '',
        }));
        setOptions(mappedOptions);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error as string);
        setLoading(false);
      }
    }
    fetchServices();
  }, [sub_category_id]);

  return (
    <>
      <Topbar
        title="Services"
        leftIcon={<IoIosArrowBack fontSize={'24px'} />}
      />
      <SearchBar
        visibility={true}
        searchEndPoint={`/service/${sub_category_id}`}
      />
      <Flex
        wrap={'wrap'}
        align={'start'}
        justify={'center'}
        className="min-h-screen lg:min-h-full lg:w-[70vw] w-full p-4 pb-[8vh]"
      >
        {error && <p>Faced a server error. Please refresh</p>}
        {loading && <p>Fetching Services</p>}
        {options.length === 0 && !loading && (
          <p>
            This service has no sub-service under it yet. IM Health is working
            on it.
          </p>
        )}
        {(searchResults.length > 0
          ? searchResults.map((item: ISubservice & { sub_category: { name: string; category_id?: { name: string } } }) => ({
            label: item.name,
            value: item._id,
            banner_image: item.banner_image,
            price: item.price,
            sub_category_name: item?.sub_category?.name,
            category_name: item?.sub_category?.category_id?.name || '',
          }))
          : options).map((option) => (
            <Box
              className="w-[95vw] lg:w-1/3 sm:w-[33vw] mr-3 lg:mr-0 mt-3"
              key={option.value}
            >
              <Link
                href={`/issue?service_id=${option.value}&service_name=${option.label}&price=${option.price}&sub_category_name=${option.sub_category_name}&category_name=${option.category_name}`}
              >
                <Flex className="w-[95vw] lg:w-full h-fit justify-start items-end relative">
                  <Flex
                    direction={'column'}
                    className="flex absolute w-[95vw] lg:w-full pl-4 pb-6 text-start justify-center items-start ml-[2.5vw]"
                  >
                    <Text
                      as="p"
                      weight="bold"
                      className="text-white text-2xl font-poppins z-10"
                    >
                      {option.label}
                    </Text>
                    <Text as="p" className="text-white text-xl font-poppins z-10">
                      {option.price}Tk
                    </Text>
                  </Flex>

                  <Image
                    width={200}
                    height={200}
                    className="w-[95vw] lg:w-full h-auto rounded-lg brightness-50 ml-[2.5vw]"
                    alt="service"
                    src={option.banner_image}
                  />
                </Flex>
              </Link>
            </Box>
          ))}
      </Flex>
    </>
  );
};

export default RadioButtonList;
