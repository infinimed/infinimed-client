'use client';
import Topbar from '@/components/Topbar';
import { useAppSelector } from '@/lib/hooks';

import { Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';

type IssueChoice = {
  id: number;
  label: string;
  image: string;
  link: string;
};

const options: IssueChoice[] = [
  {
    id: 1,
    label: 'New Issue',
    link: '/docs',
    image:
      'https://res.cloudinary.com/dgayarw1f/image/upload/v1730665005/cvs-health-scriptpath-prescription-bottle-schedule-media-gallery_yv8sml.jpg',
  },
  {
    id: 2,
    label: 'Past Issue',
    link: '/past-issue',
    image:
      'https://res.cloudinary.com/dgayarw1f/image/upload/v1730665004/history_dbxrbv.jpg',
  },
  {
    id: 3,
    label: 'Someone Else',
    link: '/someone-else',
    image:
      'https://res.cloudinary.com/dgayarw1f/image/upload/v1730665004/6-Important-Benefits-Of-Having-A-Family-Doctor_a5ziww.jpg',
  },
];

const Issue = () => {
  const searchParams = useSearchParams();
  const service_id = searchParams.get('service_id');
  const service_name = searchParams.get('service_name');
  const price = searchParams.get('price');
  const sub_category_name = searchParams.get('sub_category_name');
  const category_name = searchParams.get('category_name');
  const isLoggedIn = useAppSelector((state) => state.setIsLoggedIn);

  return (
    <>
      <Topbar title="Issue" leftIcon={<IoIosArrowBack fontSize={'24px'} />} />
      <div className="flex min-h-screen lg:min-h-[50vh] w-screen lg:w-[70vw] lg:flex-wrap space-y-1 flex-col lg:flex-row items-center">
        {options.map((option) => (
          <Flex
            wrap={'wrap'}
            justify={'center'}
            align={'center'}
            className="w-[95vw] lg:w-[22vw] sm:w-[33vw] mr-3 mt-3"
            key={option.id}
          >
            <Link
              href={`${isLoggedIn ? `./issue/${option.link}?service_id=${service_id}&service_name=${service_name}&price=${price}&sub_category_name=${sub_category_name}&category_name=${category_name}` : `./login?service_id=${service_id}&service_name=${service_name}&price=${price}&sub_category_name=${sub_category_name}&category_name=${category_name}`}`}
            >
              <Flex className="w-[95vw] lg:w-full h-fit justify-start items-end relative">
                <Flex className="flex absolute w-[95vw] lg:w-full pl-4 pb-6 text-start justify-start items-center ">
                  <Text
                    as="p"
                    weight="bold"
                    className="text-white text-4xl font-poppins z-10"
                  >
                    {option.label}
                  </Text>
                </Flex>

                <Image
                  width={300}
                  height={300}
                  className="w-[95vw] lg:w-full h-auto rounded-lg brightness-50 ml-[2.5vw] lg:ml-0"
                  alt="service"
                  src={option.image}
                />
              </Flex>
            </Link>
          </Flex>
        ))}
      </div>
    </>
  );
};

// href={`${isLoggedIn ? `./issue/${option.link}?service_id=${service_id}&service_name=${service_name}` : `./login?service_id=${service_id}&service_name=${service_name}`}`}

export default Issue;
