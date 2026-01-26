'use client';
import { Box } from '@radix-ui/themes';
import { TextField } from '@radix-ui/themes';
import React, { ReactNode, useEffect, useState, useCallback } from 'react';
// import { Magnifying } from '@radix-ui/react-icons'
import magnifyingGlass from '@/icons/magnifyingGlass.svg';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { config } from '@/config';
import axios from 'axios';
import { setMedicineSearchResults } from '@/lib/features/searchResults/medicineSearchResults';

type SearchBarProps = {
  children?: ReactNode;
  visibility?: boolean;
  width?: string;
  searchEndPoint?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  visibility,
  searchEndPoint,
}) => {
  const searchBarVisibility = useAppSelector(
    (state) => state.searchBarVisibility,
  );

  const dispatch = useAppDispatch();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${config.backendURL}/api/search${searchEndPoint}?searchTerm=${query}`,
      );

      dispatch(setMedicineSearchResults(response.data));
    } catch (err: unknown) {
      console.log(err);
      setError('Failed to fetch searh results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dispatch, searchEndPoint]);

  useEffect(() => {
    if (query.trim() === '') {
      dispatch(setMedicineSearchResults([]));
      return;
    }
    const timeoutId = setTimeout(() => {
      search(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, search, dispatch]);

  return (
    <>
      <Box
        display={searchBarVisibility || visibility ? 'block' : 'none'}
        className={`mt-2 rounded-full shadow-lg m-auto ${visibility ? 'w-[94vw] lg:w-[70vw]' : ''}`}
      >
        <TextField.Root
          radius="full"
          className={` h-9 rounded-full font-poppins`}
          size="3"
          placeholder="Search for Medicine and Medical Services"
          onChange={(e) => setQuery(e.target.value)}
        >
          <TextField.Slot className="">
            <Image src={magnifyingGlass} alt="search"></Image>
          </TextField.Slot>
        </TextField.Root>
      </Box>
      {loading ? <p>Loading</p> : <></>}
      {error ? <p>An Error Occured</p> : <></>}
    </>
  );
};
export default SearchBar;
