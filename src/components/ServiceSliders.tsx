import ServiceSlider from './ServiceSlider';
import { Box } from '@radix-ui/themes';
import Link from 'next/link';
import { config } from '@/config';

type ServiceCategory = {
  _id: string;
  name: string;
};

type ServiceSubCategory = {
  name: string;
  category_id: ServiceCategory;
};

type Service = {
  _id: string;
  name: string;
  banner_image?: string;
  sub_category: ServiceSubCategory;
};

const ServiceSliders = async () => {
  const response = await fetch(
    `${config.backendURL}/api/service/populated-services`,
    { cache: 'no-store' },
  );
  const data = response.ok ? await response.json() : { services: [] };
  const services: Service[] = data?.services ?? [];

  const groupedByCategory = services.reduce(
    (acc, service) => {
      const category = service.sub_category?.category_id;
      if (!category?._id || !category?.name) {
        return acc;
      }

      if (!acc[category._id]) {
        acc[category._id] = {
          id: category._id,
          title: category.name,
          services: [],
        };
      }

      acc[category._id].services.push(service);
      return acc;
    },
    {} as Record<
      string,
      { id: string; title: string; services: Service[] }
    >,
  );

  const categories = Object.values(groupedByCategory).sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <Box className="mt-5 mb-10 w-full">
      {categories.map((category) => (
        <div key={category.id} className="">
          <div className="flex justify-between">
            <p className="font-poppins no-scrollbar font-bold text-xl">
              {category.title}
            </p>
            <Link
              href={`/issue/services/${category.title.split(' ').join('-')}?_id=${category.id}`}
            >
              <p className="font-poppins font-semibold text-red-700 text-xl cursor-pointer">
                See More
              </p>
            </Link>
          </div>

          <ServiceSlider services={category.services}></ServiceSlider>
        </div>
      ))}
    </Box>
  );
};
export default ServiceSliders;
