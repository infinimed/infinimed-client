/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box } from '@radix-ui/themes';
import { useAppDispatch } from '@/lib/hooks';
import { setArea } from '@/lib/features/area/area';
import { useRouter } from 'next/navigation';
// import SavedAreas from '@/components/SavedAreas';
import dynamic from 'next/dynamic';
import { config } from '@/config';

const LocationMap = dynamic(() => import('@/components/MapView'), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

const Page: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [markerMoved, setMarkerMoved] = useState<boolean>(false);

  const [draggable, setDraggable] = useState(true);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [latLong, setLatLong] = useState<{ lat: string; long: string } | null>(
    null,
  );

  const API_KEY = config.barikoiApiKey;
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch matching places
  const searchPlaces = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://barikoi.xyz/api/v2/search-place?q=${searchQuery}&api_key=${API_KEY}`,
      );
      setResults(response.data.places || []);
      setSessionId(response.data.session_id);
    } catch (err: any) {
      console.log(err);
      setError('Failed to fetch places. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  // Debounce handler
  useEffect(() => {
    setDraggable(false);
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      searchPlaces(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchPlaces]);

  // Fetch place details to get latitude and longitude
  const fetchPlaceDetails = async (placeCode: string) => {
    if (!sessionId) {
      setError('Session ID is missing. Please search again.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://barikoi.xyz/api/v2/places?place_code=${placeCode}&api_key=${API_KEY}&session_id=${sessionId}`,
      );
      const details = response.data.place;
      setLatLong({ lat: details.latitude, long: details.longitude });
    } catch (err: any) {
      console.log(err);
      setError('Failed to fetch place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latLong?.lat !== '' && latLong?.long !== '' && markerMoved) {
      fetch(
        `https://barikoi.xyz/v2/api/search/reverse/geocode?api_key=${API_KEY}&longitude=${latLong?.long}&latitude=${latLong?.lat}&address=true&area=true`,
      )
        .then((res) => res.json())
        .then((res) => {
          setMarkerMoved(false);
          setSelectedPlace({
            address: res.place.address,
          });
        });
    }
  }, [latLong, API_KEY, markerMoved]);

  function handleAddAddress() {
    dispatch(
      setArea({
        _id: '0',
        detail: selectedPlace.address as string,
        area: selectedPlace.address.split(' ')[
          selectedPlace.address.split(' ').length - 2
        ] as string,
        geocode: {
          lat: parseFloat(latLong?.lat as string),
          long: parseFloat(latLong?.long as string),
        },
        barikoi_id: 0,
      }),
    );
    router.back();
  }

  const handleSelectPlace = (place: any) => {
    setDraggable(true);
    setSelectedPlace(place);
    setResults([]);
    fetchPlaceDetails(place.place_code);
  };

  return (
    <div className="search-place-component p-2 rounded-full w-[96vw] lg:w-[40vw]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for an address..."
        className="search-input rounded-full"
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          marginBottom: '10px',
        }}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul
        className="results-list p-2"
        style={{
          listStyle: 'none',
          padding: '0',
          margin: '0',
          border: results.length > 0 ? '1px solid #ccc' : 'none',
          borderRadius: '5px',
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
      >
        {results.map((place, index) => (
          <li
            key={index}
            onClick={() => handleSelectPlace(place)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {place.address}
          </li>
        ))}
      </ul>
      {selectedPlace && (
        <div
          className="selected-place-info"
          style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <p>
            <strong>Selected Address:</strong> {selectedPlace.address}
          </p>
          <p>
            <strong>Place Code:</strong> {selectedPlace.place_code}
          </p>
        </div>
      )}

      {latLong && (
        <>
          <LocationMap
            latitude={parseFloat(latLong.lat)}
            longitude={parseFloat(latLong.long)}
            address={selectedPlace?.address}
            draggable={draggable}
            setLatLong={setLatLong}
            setMarkerMoved={setMarkerMoved}
          />
          <Box className="">
            <Box
              onClick={handleAddAddress}
              className="w-[96vw] lg:w-[39vw]  bg-white mt-2 text-[#283b77] border-solid border-2 border-[#283b77] font-poppins font-bold text-xl text-center p-2 rounded-md mb-2 cursor-pointer"
            >
              Add Address
            </Box>
          </Box>
        </>
      )}
      {/* <SavedAreas /> */}
    </div>
  );
};

export default Page;
