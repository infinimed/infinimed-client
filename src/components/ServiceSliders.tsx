import React from 'react';
import ServiceSlider from './ServiceSlider';
import { Box } from '@radix-ui/themes';
import Link from 'next/link';

type ServiceSlidersProps = object;

type IService = {
  id: string;
  title: string;
  serviceSlug: string;
};

const data: IService[] = [
  {
    id: '674c143043e32c1577911dbd',
    title: 'Nursing at Home',
    serviceSlug: 'nurses-at-home',
  },
  {
    id: '674c149e43e32c1577911dbf',
    title: 'Phisiotherapy at Home',
    serviceSlug: 'phisiotherapy-at-home',
  },
  {
    id: '674c14c443e32c1577911dc1',
    title: 'Tests at Home',
    serviceSlug: 'tests-at-home',
  },
  {
    id: '674b021a08317ad40d1f681d',
    title: 'Doctor Consultation',
    serviceSlug: 'doctor-consultation',
  },
  {
    id: '674c14e143e32c1577911dc3',
    title: 'Health at Home',
    serviceSlug: 'health-at-home',
  },
];

const ServiceSliders: React.FC<ServiceSlidersProps> = () => {
  return (
    <Box className="mb-[10vh] w-full">
      {data.map((service) => (
        <div key={service.id} className="">
          <div className="flex justify-between">
            <p className="font-poppins no-scrollbar font-bold text-xl">
              {service.title}
            </p>
            <Link
              href={`/issue/services/${service.title.split(' ').join('-')}?_id=${service.id}`}
            >
              <p className="font-poppins font-semibold text-red-700 text-xl cursor-pointer">
                See More
              </p>
            </Link>
          </div>

          <ServiceSlider serviceSlug={service.serviceSlug}></ServiceSlider>
        </div>
      ))}
    </Box>
  );
};
export default ServiceSliders;
