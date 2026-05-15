'use client';

import { Flex } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';

type ServiceSliderProps = {
  services: Service[];
};

type Service = {
  _id: string;
  name: string;
  banner_image?: string;
  generic?: string;
  price?: number;
};

const DRAG_THRESHOLD = 5;

const ServiceSlider: React.FC<ServiceSliderProps> = ({ services }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const state = dragState.current;
    if (!el || !state.active) return;
    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      state.moved = true;
      setIsDragging(true);
    }
    if (state.moved) {
      el.scrollLeft = state.startScroll - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    dragState.current.active = false;
    if (dragState.current.moved) {
      setTimeout(() => setIsDragging(false), 0);
    }
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Flex
      ref={scrollerRef}
      justify={'start'}
      align={'start'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      className={`w-full overflow-scroll no-scrollbar mt-3 h-full select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {services.slice(0, 4).map((service) => (
        <Link
          key={service._id}
          href={`/issue/service/${service._id}`}
          draggable={false}
          className="relative flex flex-col my-6 mr-4 bg-white shadow-sm border border-slate-200 rounded-lg w-[60vw] sm:w-[33vw] lg:w-[22vw] shrink-0 hover:shadow-lg transition-shadow"
        >
          <div className="relative p-2.5 aspect-video w-full overflow-hidden rounded-xl bg-clip-border">
            <Image
              width={400}
              height={400}
              className="h-full w-full object-cover rounded-md pointer-events-none"
              alt={service.name}
              src={service.banner_image as string}
              draggable={false}
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-slate-800 text-lg font-poppins font-semibold truncate">
                {service.name}
              </p>
              {typeof service.price === 'number' && (
                <p className="text-cyan-600 text-lg font-semibold whitespace-nowrap">
                  ${service.price.toFixed(2)}
                </p>
              )}
            </div>
            {service.generic && (
              <p className="text-slate-600 leading-normal font-light text-sm">
                {service.generic}
              </p>
            )}
          </div>
        </Link>
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
