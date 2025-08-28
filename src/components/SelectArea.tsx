'use client';
import { IArea } from '@/interfaces/IArea';
import { setArea } from '@/lib/features/area/area';
import { changeAreaDropDownOpenState } from '@/lib/features/areaDropDownOpen/searchBarVisibility';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Select } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { MouseEventHandler, useEffect, useState } from 'react';

type SelectAreaProps = {
  children?: string;
};

const areas: IArea[] = [
  {
    _id: '1',
    detail: '',
    area: 'Dhanmondi',
    geocode: {
      lat: 23,
      long: 91,
    },
  },
  {
    _id: '2',
    detail: '',
    area: 'Gulshan',
    geocode: {
      lat: 23,
      long: 91,
    },
  },
  {
    _id: '3',
    detail: '',
    area: 'Beribadh',
    geocode: {
      lat: 23,
      long: 91,
    },
  },
];

const SelectArea: React.FC<SelectAreaProps> = () => {
  const dispatch = useAppDispatch();
  const area = useAppSelector((state) => state.area);

  const [currentArea, setCurrentArea] = useState<IArea>({
    _id: '',
    geocode: {
      lat: 0,
      long: 0,
    },
    detail: 'Road 9/A, Sankar',
    area: 'Dhanmondi',
  });
  const router = useRouter();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://barikoi.xyz/v2/api/search/reverse/geocode?api_key=bkoi_c357a88b8391dd7525f57b69b97bfe07c01e244c25591312a047da14c0838283&longitude=${longitude}&latitude=${latitude}&address=true&area=true`,
          );
          const data = await response.json();

          setCurrentArea({
            _id: '0',
            geocode: {
              lat: latitude,
              long: longitude,
            },
            detail: data.place?.address || 'Road 9/A, Sankar',
            area: data.place?.area || 'Dhanmondi',
          });
          if (!area._id) {
            dispatch(
              setArea({
                _id: '0',
                geocode: {
                  lat: latitude,
                  long: longitude,
                },
                detail: data.place?.address || 'Road 9/A, Sankar',
                area: data.place?.area || 'Dhanmondi',
              }),
            );
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  function onAreaChange(e: string) {
    if (e === 'current-area') {
      dispatch(setArea(currentArea));
    } else if (e === 'choose-area') {
      router.push('/add-area');
    } else {
      const area = areas.find((area) => area._id == e);
      dispatch(setArea(area as IArea));
    }
  }

  const handleItemClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  function onOpenChange() {
    dispatch(changeAreaDropDownOpenState());
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <Image
          src="https://res.cloudinary.com/dgayarw1f/image/upload/v1745768384/Neomorphic_Icon_set_002-10_ecbp7k.svg"
          alt="marker"
          width={70}
          height={70}
          className="h-12 w-auto mr-1 shadow-lg rounded-full"
        ></Image>
        <Select.Root
          onValueChange={onAreaChange}
          defaultValue="current-location"
          onOpenChange={onOpenChange}
        >
          <Select.Trigger variant="ghost" />
          <Select.Content className="font-poppins z-1000 absolute w-[70vw]">
            <Select.Item className="font-poppins" value={'current-location'}>
              <p className="text-base font-poppins">
                {area.area || currentArea.area || ''}
              </p>
            </Select.Item>
            {areas.map((area: IArea) => (
              <Select.Item
                className="font-poppins"
                key={area._id}
                value={area._id.toString()}
                onClick={handleItemClick}
              >
                <p className="text-base font-poppins">{area.area}</p>
              </Select.Item>
            ))}
            <Select.Item
              onClick={handleItemClick}
              className="font-poppins z-1000 absolute"
              value={'choose-area'}
            >
              <Link href={'/add-area'}>
                <p className="text-base font-poppins w-fit">Show Map</p>
              </Link>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </>
  );
};
export default SelectArea;
