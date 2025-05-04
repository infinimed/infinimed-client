'use client';
import { config } from '@/config';
import { IService } from '@/interfaces/IService';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type SideNavbarProps = {
  children?: string;
};

const SideNavbar: React.FC<SideNavbarProps> = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      const response = await fetch(
        `${config.backendURL}/api/service/category/`,
      );
      const data = await response.json();
      setServices(data.serviceCategories);
    }
    fetchServices();
  }, []);

  return (
    <div className="">
      {services.map((service: IService) => (
        <Link
          key={service._id}
          href={
            service.name.includes('Pharmacy')
              ? '/pharmacy'
              : `/issue/services/${service.name.split(' ').join('-')}?_id=${service._id}`
          }
        >
          <div
            key={service._id}
            className="p-2 flex items-center border-gray-300 border-b-[1px] w-[18vw]"
          >
            <Image
              src={service.icon}
              width={60}
              height={60}
              alt="service-icon"
              className="shadow-md rounded-sm"
            ></Image>
            <p className="ml-5 font-bold">{service.name}</p>
          </div>
        </Link>
      ))}
      <Link href={'/past-orders'}>
        <div className="p-2 flex items-center border-gray-300 border-b-[1px] w-[18vw] ">
          <Image
            src={
              'https://res.cloudinary.com/dgayarw1f/image/upload/v1745768380/Neomorphic_Icon_set_002-06_lemien.svg'
            }
            width={60}
            height={60}
            className="shadow-md"
            alt="service-icon"
          ></Image>
          <p className="ml-5 font-bold">Orders</p>
        </div>
      </Link>
    </div>
  );
};
export default SideNavbar;
