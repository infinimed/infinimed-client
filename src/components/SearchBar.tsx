'use client';
import { Box } from '@radix-ui/themes';
import { TextField } from '@radix-ui/themes';
import React, { ReactNode, useEffect, useState } from 'react';
// import { Magnifying } from '@radix-ui/react-icons'
// import magnifyingGlass from '@/icons/magnifyingGlass.svg';
import Image from 'next/image';
import { useAppSelector } from '@/lib/hooks';
import { ISearchResult } from '@/interfaces/ISearchResult';
import { config } from '@/config';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type SearchBarProps = {
  children?: ReactNode;
  visibility?: boolean;
  width?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ visibility }) => {
  const searchBarVisibility = useAppSelector(
    (state) => state.searchBarVisibility,
  );
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      search(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const search = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${config.backendURL}/api/search?searchTerm=${query}`,
      );
      setResults(response.data);
      // console.log(response);
    } catch (err: unknown) {
      console.log(err);
      setError('Failed to fetch place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  async function handleSelect(result: ISearchResult) {
    if (result.category === 'service') {
      router.push(`/issue/service/${result.id}`);
    } else {
      router.push(`/medicine/${result.id}`);
    }
  }
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
            <Image
              src="https://res.cloudinary.com/dgayarw1f/image/upload/v1742114434/Search_01_qopros.png"
              width={50}
              height={50}
              alt="search"
            ></Image>
          </TextField.Slot>
        </TextField.Root>

        <ul
          className="results-list lg:w-[70vw] w-[94vw] list-none z-10 m-0 mt-[1rem] rounded-sm max-h-[200px] overflow-y-auto bg-white absolute"
          style={{
            border: results.length > 0 || loading ? '1px solid #ccc' : 'none',
          }}
        >
          {loading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="p-[10px]">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </li>
              ))}
            </>
          )}
          {error && <li className="p-[10px] text-red-600">{error}</li>}
          {!loading && results.map((result) => (
            <li
              className="p-[10px] cursor-pointer hover:bg-gray-50"
              key={result.id}
              onClick={() => handleSelect(result)}
              style={{
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {result.name}
            </li>
          ))}
        </ul>
      </Box>
    </>
  );
};
export default SearchBar;
