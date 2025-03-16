'use client';
import { changeSearchBarVisibilityState } from '@/lib/features/searchBar/searchBarVisibility';
import { useAppDispatch } from '@/lib/hooks';
import Image from 'next/image';
import React from 'react';

type SearchIconProps = object;

const SearchIcon: React.FC<SearchIconProps> = () => {
  const dispatch = useAppDispatch();

  return (
    <Image
      src="https://res.cloudinary.com/dgayarw1f/image/upload/v1742114434/Search_01_qopros.png"
      height={50}
      width={50}
      alt=""
      className=""
      onClick={() => {
        dispatch(changeSearchBarVisibilityState());
      }}
    ></Image>
  );
};
export default SearchIcon;
