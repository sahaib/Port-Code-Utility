import React, { useState, useRef } from 'react';
import { SearchBar } from './SearchBar';
import { Map, NavigationControl, Marker, Layer, Source } from 'react-map-gl';
import { parseCoordinates } from '../utils/distanceUtils';
import { Ship, Loader2 } from 'lucide-react';
import { PortData } from '../types/port';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';


interface DistanceCalculatorProps {
  onSearch: (value: string, countryCode: string) => Promise<PortData[]>;
  isDark: boolean;
}

export const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({ onSearch, isDark }) => {
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

  const [viewport, setViewport] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5
  });

  const [routeGeometry, setRouteGeometry] = useState<any>(null);

  // Add ref for Map component
  const mapRef = useRef<any>(null);

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
  
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${parseCoordinates(originPort.coordinates).longitude},${parseCoordinates(originPort.coordinates).latitude};${parseCoordinates(destPort.coordinates).longitude},${parseCoordinates(destPort.coordinates).latitude}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        setRouteGeometry({
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        });
        setDistance(route.distance / 1852);
        
        // Create bounds
        const bounds = new mapboxgl.LngLatBounds();
        route.geometry.coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });

        // Use map ref to fit bounds
        mapRef.current?.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate route');
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

<div className="bg-white p-4 rounded-xl shadow-lg h-[600px]">
          <Map
            ref={mapRef}
            {...viewport}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle={isDark ? "mapbox://styles/mapbox/navigation-night-v1" : "mapbox://styles/mapbox/navigation-day-v1"}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          >
            <NavigationControl />
            {origin && (
              <Marker
                latitude={parseCoordinates(origin.coordinates).latitude}
                longitude={parseCoordinates(origin.coordinates).longitude}
              >
                {origin.type === 'port' ? <Ship className="text-blue-500" /> : <MapPin className="text-red-500" />}
              </Marker>
            )}
            {destination && (
              <Marker
                latitude={parseCoordinates(destination.coordinates).latitude}
                longitude={parseCoordinates(destination.coordinates).longitude}
              >
                {destination.type === 'port' ? <Ship className="text-blue-500" /> : <MapPin className="text-red-500" />}
              </Marker>
            )}
            {routeGeometry && (
              <Source type="geojson" data={routeGeometry}>
                <Layer
                  id="route"
                  type="line"
                  paint={{
                    'line-color': '#0066FF',
                    'line-width': 3,
                    'line-opacity': 0.8
                  }}
                />
              </Source>
            )}
          </Map>
        </div>
    </div>
  );
}; 