'use client';
import React from 'react';
import Image from 'next/image';
import { Flex, Box, Text } from '@radix-ui/themes';
// import { Label } from '@radix-ui/react-label';
// import { Carousel } from 'flowbite-react';
//@ts-expect-error no type declaration
// import Slider from 'react-infinite-logo-slider';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import Link from 'next/link';
// import { useAppSelector } from '@/lib/hooks';
// import Carousel from 'react-multi-carousel';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type RecommendationProps = {};

type IRecommendation = {
  id: number;
  image: string;
  title: string;
  link: string;
};

const data: IRecommendation[] = [
  {
    id: 1,
    image:
      'https://res.cloudinary.com/dlezm6lou/image/upload/v1746249506/banner2_x4acuo.jpg',
    title: 'Pharmacy',
    link: '/issue',
  },
  {
    id: 2,
    image:
      'https://res.cloudinary.com/dlezm6lou/image/upload/v1746249506/banner1_jurrbe.jpg',
    title: 'Nursing',
    link: '/issue',
  },
  {
    id: 3,
    image:
      'https://res.cloudinary.com/dlezm6lou/image/upload/v1746249506/banner3_iavzk0.jpg',
    title: 'Phisiotherapy',
    link: '/issue',
  },
];

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 700,
  autoplaySpeed: 4000,
  cssEase: 'linear',
};

const Recommendation: React.FC<RecommendationProps> = () => {
  // const dropdownOpenState = useAppSelector(
  //   (state) => state.changeAreaDropDownOpenState,
  // );

  return (
    <Box>
      {/* <Label className="font-poppins no-scrollbar font-bold text-xl z-30 mb-[5vh] mt-3">
        Recommended For you
      </Label> */}
      {/* <Flex className="w-[95vw] overflow-scroll no-scrollbar mt-3"> */}
      <Slider {...settings} className="lg:w-[70vw] mt-3">
        {data.map((service: IRecommendation) => (
          <Box className="w-[95vw] lg:w-[70vw] mr-3" key={service.id}>
            <Flex className="w-[95vw] lg:w-[70vw] h-fit justify-start items-end relative">
              <Flex className="flex absolute w-[95vw] lg:w-[70vw] pl-4 pb-6 text-start justify-start items-center">
                <Text
                  as="p"
                  weight="bold"
                  className="text-white text-4xl font-poppins"
                >
                  {service.title}
                </Text>
              </Flex>

              <Image
                width={400}
                height={400}
                className="w-[93vw] lg:w-[70vw] lg:h-[40vh] rounded-lg object-cover"
                alt="service"
                src={service.image}
              />
            </Flex>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
export default Recommendation;
