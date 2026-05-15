'use client';

import Topbar from '@/components/Topbar';
import { IoIosArrowBack } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import { config } from '@/config';
import { ISubservice } from '@/interfaces/ISubservice';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import { useAppSelector } from '@/lib/hooks';
import CartIconTopbar from '@/components/CartIconTopbar';

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
        const mappedOptions = data.services.map(
          (
            service: ISubservice & {
              sub_category: { name: string; category_id?: { name: string } };
            },
          ) => ({
            label: service.name,
            value: service._id,
            banner_image: service.banner_image,
            price: service.price,
            sub_category_name: service?.sub_category?.name,
            category_name: service?.sub_category?.category_id?.name || '',
          }),
        );
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
        rightIcon={<CartIconTopbar></CartIconTopbar>}
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
          ? searchResults.map(
              (
                item: ISubservice & {
                  sub_category: {
                    name: string;
                    category_id?: { name: string };
                  };
                },
              ) => ({
                label: item.name,
                value: item._id,
                banner_image: item.banner_image,
                price: item.price,
                sub_category_name: item?.sub_category?.name,
                category_name: item?.sub_category?.category_id?.name || '',
              }),
            )
          : options
        ).map((option) => (
          <Link
            key={option.value}
            href={`/issue?service_id=${option.value}&service_name=${option.label}&price=${option.price}&sub_category_name=${option.sub_category_name}&category_name=${option.category_name}`}
            className="relative flex flex-col my-3 mx-2 bg-white shadow-sm border border-slate-200 rounded-lg w-[95vw] sm:w-[33vw] lg:w-[30%] hover:shadow-lg transition-shadow"
          >
            <div className="relative p-2.5 aspect-video w-full overflow-hidden rounded-xl bg-clip-border">
              <Image
                width={400}
                height={400}
                className="h-full w-full object-cover rounded-md"
                alt={option.label}
                src={option.banner_image}
              />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-slate-800 text-lg font-poppins font-semibold truncate">
                  {option.label}
                </p>
                <p className="text-cyan-600 text-lg font-semibold whitespace-nowrap">
                  {option.price}Tk
                </p>
              </div>
            </div>
          </Link>
        ))}
      </Flex>
    </>
  );
};

export default RadioButtonList;
