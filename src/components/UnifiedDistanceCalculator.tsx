import React, { useState } from 'react';
import { Map, NavigationControl, Marker, Source, Layer } from 'react-map-gl';
import { parseCoordinates } from '../utils/distanceUtils';
import { Ship, MapPin, Loader2 } from 'lucide-react';
import { Location, LocationType } from '../types/location';
import { searchPostalLocation } from '../services/locationService';
import { fetchPortData } from '../services/portService';
import { isValidLocode } from '../utils/portUtils';
import { LocationSearch } from './LocationSearch';
import { getBounds, getZoomLevel } from '../utils/mapUtils';
import '../styles/globals.css';
import { env } from '../config/env';
  

export const UnifiedDistanceCalculator: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });
  const [routeGeometry, setRouteGeometry] = useState<GeoJSON.Feature | null>(null);

  const handleSearch = async (
    value: string,
    countryCode: string,
    type: LocationType
  ): Promise<Location[]> => {
    try {
      setError(null);
      setIsLoading(true);
      if (type === 'port') {
        const response = await fetchPortData({
          value,
          type: isValidLocode(value) ? 'locode' : 'name',
          countryCode
        });
        return response.ports.map(port => ({
          type: 'port',
          id: port.locode,
          name: port.name,
          countryCode: port.locode.slice(0, 2),
          coordinates: parseCoordinates(port.coordinates),
          locode: port.locode,
          function: port.function,
          status: port.status
        }));
      } else {
        const response = await searchPostalLocation(value, countryCode);
        return response.locations;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateDistance = async () => {
    if (!origin || !destination) {
      setError('Please select both origin and destination locations');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.coordinates.longitude},${origin.coordinates.latitude};${destination.coordinates.longitude},${destination.coordinates.latitude}?geometries=geojson&access_token=${env.MAPBOX_TOKEN}`
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
        
        const bounds = getBounds([origin.coordinates, destination.coordinates]);
        const padding = 0.5;
        setViewport({
          latitude: (bounds.north + bounds.south) / 2,
          longitude: (bounds.east + bounds.west) / 2,
          zoom: Math.min(getZoomLevel(bounds) - padding, 8)
        });
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      setError('Failed to calculate route');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Origin</h2>
            <LocationSearch
              label="From"
              onLocationSelect={setOrigin}
              selectedLocation={origin}
              onSearch={handleSearch}
              isDark={isDark}
            />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Destination</h2>
            <LocationSearch
              label="To"
              onLocationSelect={setDestination}
              selectedLocation={destination}
              onSearch={handleSearch}
              isDark={isDark}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          {distance !== null && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-bold text-green-800">Distance:</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-green-600">Nautical Miles</p>
                  <p className="text-lg font-bold text-green-700">
                    {Math.round(distance)} nm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Kilometers</p>
                  <p className="text-lg font-bold text-green-700">
                    {Math.round(distance * 1.852)} km
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button
              onClick={handleCalculateDistance}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-lg
                ${isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-200'
                } transition-colors disabled:cursor-not-allowed`}
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
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg h-[600px]">
          <Map
            {...viewport}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle={isDark ? "mapbox://styles/mapbox/navigation-night-v1" : "mapbox://styles/mapbox/navigation-day-v1"}
            mapboxAccessToken={env.MAPBOX_TOKEN}
          >
            <NavigationControl />
            {origin && (
              <Marker
                latitude={origin.coordinates.latitude}
                longitude={origin.coordinates.longitude}
              >
                {origin.type === 'port' ? <Ship className="text-blue-500" /> : <MapPin className="text-red-500" />}
              </Marker>
            )}
            {destination && (
              <Marker
                latitude={destination.coordinates.latitude}
                longitude={destination.coordinates.longitude}
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
    </div>
  );
};