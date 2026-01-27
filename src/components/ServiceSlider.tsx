import { Box, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';

type ServiceSliderProps = {
  services: Service[];
};

type Service = {
  _id: string;
  name: string;
  banner_image?: string;
};

const ServiceSlider: React.FC<ServiceSliderProps> = ({ services }) => {
  return (
    <Flex
      justify={'start'}
      align={'start'}
      className="w-full overflow-scroll no-scrollbar mt-3 h-full"
    >
      {services.slice(0, 4).map((service) => (
        <Box
          className="w-[60vw] sm:w-[33vw] lg:w-[22vw] mr-3 mt-3 drop-shadow-lg"
          key={service._id}
        >
          <Link href={`/issue/service/${service._id}`}>
            <Flex
              direction={'column'}
              className="w-[60vw] lg:w-full h-fit justify-start items-end relative"
            >
              <Image
                width={200}
                height={200}
                className="w-[60vw] lg:w-full h-auto rounded-lg"
                alt="service"
                src={service.banner_image as string}
              />
              <Flex
                justify={'between'}
                className="flex w-[60vw] lg:w-full pb-2 text-start justify-between items-center mt-3 pr-2"
              >
                <Text
                  as="p"
                  weight={'bold'}
                  className="text-black text-lg font-poppins w-full"
                >
                  {service.name}
                </Text>
                {/* <Button className="w-1/3 rounded-full">+</Button> */}
              </Flex>
            </Flex>
          </Link>
        </Box>
      ))}
      {/* <div className=" w-[45vw] lg:w-fit sm:w-[33vw] mr-3 mt-3 drop-shadow-lg h-full lg:hidden">
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
      </div> */}
    </Flex>
  );
};
export default ServiceSlider;
