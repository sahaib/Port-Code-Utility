import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Map, NavigationControl, Marker } from 'react-map-gl';
import { calculateDistance, parseCoordinates } from '../utils/distanceUtils';
import { Ship, Loader2 } from 'lucide-react';
import { PortData } from '../types/port';
import 'mapbox-gl/dist/mapbox-gl.css';

interface DistanceCalculatorProps {
  onSearch: (value: string, countryCode: string) => Promise<PortData[]>;
}

export const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState<PortData | null>(null);
  const [destination, setDestination] = useState<PortData | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search states
  const [originSearch, setOriginSearch] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [destCountry, setDestCountry] = useState('');

  const handleCalculateDistance = async () => {
    if (!originSearch || !originCountry || !destSearch || !destCountry) {
      setError('Please fill in both origin and destination ports');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      // Use the same search function as port lookup
      const [originPorts, destPorts] = await Promise.all([
        onSearch(originSearch, originCountry),
        onSearch(destSearch, destCountry)
      ]);
  
      if (!originPorts.length || !destPorts.length) {
        throw new Error('One or both ports not found');
      }
  
      const originPort = originPorts[0];
      const destPort = destPorts[0];
  
      // Log coordinates for debugging
      console.log('Origin coordinates:', originPort.coordinates);
      console.log('Destination coordinates:', destPort.coordinates);
  
      if (!originPort.coordinates || !destPort.coordinates) {
        throw new Error('Missing coordinates for one or both ports');
      }
  
      setOrigin(originPort);
      setDestination(destPort);
  
      const dist = calculateDistance(
        parseCoordinates(originPort.coordinates),
        parseCoordinates(destPort.coordinates)
      );
      
      setDistance(dist);
    } catch (err) {
      console.error('Distance calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate distance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Origin</h2>
          <SearchBar
            value={originSearch}
            countryCode={originCountry}
            onChange={setOriginSearch}
            onCountryChange={setOriginCountry}
            onSubmit={() => {}}
            isLoading={false}
            hideSearchIcon={true}
          />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Destination</h2>
          <SearchBar
            value={destSearch}
            countryCode={destCountry}
            onChange={setDestSearch}
            onCountryChange={setDestCountry}
            onSubmit={() => {}}
            isLoading={false}
            hideSearchIcon={true}
          />
        </div>
      </div>

      <div className="flex justify-center">
      <button
          onClick={handleCalculateDistance}
          disabled={isLoading}
          className="claymorphic claymorphic-primary calculate-button px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 font-medium text-lg"
        >
  {isLoading ? (
    <>
      <Loader2 className="animate-spin" size={24} />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Ship size={24} />
              <span>Calculate Distance</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-center">{error}</div>
      )}

      {distance && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-600">Nautical Miles</p>
              <p className="text-2xl font-bold">{Math.round(distance)} nm</p>
            </div>
            <div>
              <p className="text-gray-600">Kilometers</p>
              <p className="text-2xl font-bold">{Math.round(distance * 1.852)} km</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <Map
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 1
          }}
          style={{ width: '100%', height: 400 }}
          mapStyle="mapbox://styles/mapbox/navigation-night-v1"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          <NavigationControl />
          {origin && (
            <Marker
              longitude={parseCoordinates(origin.coordinates).longitude}
              latitude={parseCoordinates(origin.coordinates).latitude}
            >
              <Ship className="text-blue-500" size={24} />
            </Marker>
          )}
          {destination && (
            <Marker
              longitude={parseCoordinates(destination.coordinates).longitude}
              latitude={parseCoordinates(destination.coordinates).latitude}
            >
              <Ship className="text-red-500" size={24} />
            </Marker>
          )}
        </Map>
      </div>
    </div>
  );
}; 