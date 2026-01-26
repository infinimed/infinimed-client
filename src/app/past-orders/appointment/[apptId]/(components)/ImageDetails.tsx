'use client';
import { Box, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useEffect, useRef, useCallback } from 'react';
//@ts-expect-error no type declaration
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type ImageDetailsProps = {
  assets: string[];
  expandPhotos: boolean;
  setExpandPhotos: (prev: boolean) => void;
};

const settings = {
  dots: true,
  infinite: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  speed: 700,
  autoplaySpeed: 4000,
  cssEase: 'linear',
};

const ImageDetails: React.FC<ImageDetailsProps> = ({
  assets,
  expandPhotos,
  setExpandPhotos,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    console.log('inside');
    if (
      modalRef.current &&
      !modalRef.current?.contains(event.target as HTMLDivElement)
    ) {
      setExpandPhotos(false);
    }
  }, [setExpandPhotos]);

  useEffect(() => {
    // Event listener logic

    if (expandPhotos) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandPhotos, handleClickOutside]);

  return (
    <Flex
      justify={'center'}
      className="lg:fixed hidden lg:top-[20vh] lg:w-[40vw] w-[96vw]  lg:bg-white border-solid border-indigo-900 border-2 lg:pb-[7vh] rounded-lg"
      ref={modalRef}
    >
      <div className=" lg:w-fit lg:h-fit">
        <Slider {...settings} className="w-[70w] lg:w-[30vw] mt-3">
          {assets.map((image: string) => (
            <Box className="w-[80vw] lg:w-[30vw] mr-3" key={image}>
              <Flex className="w-[80vw] lg:w-[30vw] lg:h-fit justify-start items-end relative">
                <Image
                  width={400}
                  height={400}
                  className="w-[80vw] h-[20vw] lg:w-[30vw] lg:h-[40vh] rounded-lg object-cover"
                  alt="service"
                  src={image}
                />
              </Flex>
            </Box>
          ))}
        </Slider>
      </div>
    </Flex>
  );
};
export default ImageDetails;
