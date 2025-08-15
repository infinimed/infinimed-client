/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
  latitude: number;
  longitude: number;
  address?: string;
  draggable?: boolean;
  setLatLong: ({ lat, long }: { lat: string; long: string }) => void;
  setMarkerMoved: (state: boolean) => void;
}

const LocationMap: React.FC<Props> = ({
  latitude,
  longitude,
  address = 'Selected Location',
  draggable,
  setLatLong,
  setMarkerMoved,
}) => {
  // const LocationMap = React.forwardRef<HTMLDivElement | null, Props>(
  //   ({ latitude, longitude, address, draggable }, ref) => {
  React.useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const markerRef = useRef<L.Marker | null>(null);

  const ClickHandler: React.FC = () => {
    useMapEvents({
      click(e) {
        setLatLong({
          lat: e.latlng.lat.toString(),
            long: e.latlng.lng.toString(),
        });
        setMarkerMoved(true);
      },
    });
    return null;
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const latLong = marker.getLatLng();
          setLatLong({
            lat: latLong.lat.toString(),
            long: latLong.lng.toString(),
          });
          setMarkerMoved(true);
        }
      },
    }),
    [setLatLong, setMarkerMoved],
  );

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <ClickHandler />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[latitude, longitude]}
          draggable={draggable}
          ref={markerRef}
          eventHandlers={eventHandlers}
        >
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
LocationMap.displayName = 'Location Map';
export default LocationMap;
