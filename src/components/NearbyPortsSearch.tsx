import React, { useState } from 'react';
import { Map, NavigationControl, Marker, Source, Layer } from 'react-map-gl';
import { Ship, MapPin, Loader2 } from 'lucide-react';
import { LocationSearch } from './LocationSearch';
import { Location } from '../types/location';
import { fetchPortData, findNearbyPorts } from '../services/portService';
import { env } from '../config/env';
import { searchPostalLocation } from '../services/locationService';
import { exportToCSV } from '../utils/exportUtils';

interface NearbyPort {
  locode: string;
  name: string;
  distance: number;
  latitude: number;
  longitude: number;
  countryCode: string;
}

export const NearbyPortsSearch: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [radius, setRadius] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyPorts, setNearbyPorts] = useState<NearbyPort[]>([]);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  const handleSearch = async () => {
    if (!location) {
      setError('Please select a location first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ports = await findNearbyPorts(
        location.coordinates.latitude,
        location.coordinates.longitude,
        radius
      );

      setNearbyPorts(ports.map(port => ({
        locode: port.locode,
        name: port.name,
        distance: port.distance || 0,
        latitude: port.latitude,
        longitude: port.longitude,
        countryCode: port.countryCode
      })));
      
      // Center map on search area
      setViewport({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        zoom: 8
      });

    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to find nearby ports');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <LocationSearch
              label="Location"
              onLocationSelect={setLocation}
              selectedLocation={location}
              onSearch={async (value, countryCode, type) => {
                console.log('Searching:', { value, countryCode, type });
                try {
                  if (type === 'postal') {
                    const result = await searchPostalLocation(value, countryCode);
                    return result.locations;
                  }
                  
                  // Try LOCODE first if it matches the format
                  if (value.match(/^[A-Z]{5}$/)) {
                    const response = await fetchPortData({ 
                      value, 
                      type: 'locode', 
                      countryCode 
                    });
                    if (response.ports.length > 0) {
                      return response.ports.map(port => ({
                        type: 'port' as const,
                        id: port.locode,
                        name: port.name,
                        countryCode: port.countryCode,
                        coordinates: {
                          latitude: port.latitude,
                          longitude: port.longitude
                        },
                        locode: port.locode,
                        function: port.function,
                        status: port.status
                      }));
                    }
                  }
                  
                  // Fall back to name search
                  const response = await fetchPortData({ 
                    value, 
                    type: 'name', 
                    countryCode 
                  });
                  return response.ports.map(port => ({
                    type: 'port' as const,
                    id: port.locode,
                    name: port.name,
                    countryCode: port.countryCode,
                    coordinates: {
                      latitude: port.latitude,
                      longitude: port.longitude
                    },
                    locode: port.locode,
                    function: port.function,
                    status: port.status
                  }));
                } catch (error) {
                  console.error('Search error:', error);
                  throw error;
                }
              }}
              isDark={isDark}
              allowPostal={true}
            />

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius (km)
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-2">
                {radius} kilometers
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading || !location}
              className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
                ${isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-200'
                } transition-colors disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Ship size={24} />
                  <span>Find Nearby Ports</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          {nearbyPorts.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Nearby Ports from {location?.name || 'Selected Location'}
                </h3>
                <button
                  onClick={() => exportToCSV(nearbyPorts, `nearby_ports_${location?.name || 'location'}`)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Port Name</th>
                      <th className="px-4 py-2 text-left">LOCODE</th>
                      <th className="px-4 py-2 text-left">Country</th>
                      <th className="px-4 py-2 text-right">Distance (km)</th>
                      <th className="px-4 py-2 text-right">Distance (nm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nearbyPorts.map(port => (
                      <tr key={port.locode} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{port.name}</td>
                        <td className="px-4 py-2 font-mono">{port.locode}</td>
                        <td className="px-4 py-2">{port.countryCode}</td>
                        <td className="px-4 py-2 text-right">{Math.round(port.distance)}</td>
                        <td className="px-4 py-2 text-right">{Math.round(port.distance / 1.852)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg h-[600px]">
          <Map
            {...viewport}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle={isDark ? "mapbox://styles/mapbox/navigation-night-v1" : "mapbox://styles/mapbox/navigation-day-v1"}
            mapboxAccessToken={env.MAPBOX_TOKEN}
          >
            <NavigationControl />
            
            {location && (
              <Marker
                latitude={location.coordinates.latitude}
                longitude={location.coordinates.longitude}
              >
                <div className="relative">
                  <MapPin className="text-red-500 w-8 h-8" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-sm">
                    Origin
                  </div>
                </div>
              </Marker>
            )}

            {nearbyPorts.map(port => (
              <Marker
                key={port.locode}
                latitude={port.latitude}
                longitude={port.longitude}
              >
                <div className="relative group">
                  <Ship className="text-blue-500 w-6 h-6" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {port.name} ({Math.round(port.distance)} km)
                  </div>
                </div>
              </Marker>
            ))}

            {location && (
              <Source
                type="geojson"
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: [location.coordinates.longitude, location.coordinates.latitude]
                  }
                }}
              >
                <Layer
                  id="search-radius"
                  type="circle"
                  paint={{
                    'circle-radius': {
                      'base': 2,
                      'stops': [
                        [0, 0],
                        [20, radius * 1000] // Convert km to meters for proper scale
                      ]
                    },
                    'circle-color': '#3B82F6',
                    'circle-opacity': 0.2,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#2563EB',
                    'circle-stroke-opacity': 0.4
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