import { BulkCalculationRow, BulkCalculationResult, ProcessingStats } from '../types/bulk';
import { searchPostalLocation } from './locationService';
import { fetchPortData } from './portService';
import { calculateDistance } from '../utils/distanceUtils';

export const calculateBulkDistances = async (
  data: Array<BulkCalculationRow>,
  onProgress: (progress: number, currentStats: ProcessingStats) => void
): Promise<BulkCalculationResult[]> => {
  const results: BulkCalculationResult[] = [];
  let processed = 0;
  let successful = 0;
  let failed = 0;

  for (const row of data) {
    try {
      // Get source coordinates
      const sourceCoords = await getCoordinates(row.sourceType, row.sourceLocation);
      
      // Get destination coordinates
      const destCoords = await getCoordinates(row.destType, row.destLocation);

      if (!sourceCoords || !destCoords) {
        failed++;
        results.push({
          ...row,
          distance: null,
          status: 'error',
          error: 'Could not resolve coordinates'
        });
        continue;
      }

      // Calculate distance
      const distance = calculateDistance(sourceCoords, destCoords);
      successful++;

      results.push({
        ...row,
        distance,
        status: 'success'
      });

    } catch (error) {
      failed++;
      results.push({
        ...row,
        distance: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    processed++;
    onProgress(processed / data.length, { processed, total: data.length, successful, failed });
  }

  return results;
};

async function getCoordinates(
  locationType: 'port' | 'postal',
  location: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    if (locationType === 'port') {
      const countryCode = location.slice(0, 2);
      const portData = await fetchPortData({
        value: location,
        type: 'locode',
        countryCode
      });

      // Case 1: Found in UN/LOCODE with coordinates
      if (portData.ports.length > 0 && portData.ports[0].coordinates) {
        try {
          const [lat, lon] = portData.ports[0].coordinates.split(' ').map(coord => {
            const deg = parseFloat(coord.slice(0, -1));
            const dir = coord.slice(-1);
            return dir === 'S' || dir === 'W' ? -deg : deg;
          });
          return { latitude: lat, longitude: lon };
        } catch (error) {
          console.warn(`Invalid coordinate format in UN/LOCODE for ${location}`);
        }
      }

      // Case 2: Found in UN/LOCODE but no coordinates, try Mapbox with port name
// Case 2: Found in UN/LOCODE but no coordinates, try Mapbox with port name
if (portData.ports.length > 0) {
    try {
      const portName = portData.ports[0].name;
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!mapboxToken) {
        throw new Error('Mapbox token not configured');
      }
      
      // Using the same pattern as locationService.ts
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(portName)}.json`;
      const params = new URLSearchParams({
        access_token: mapboxToken,
        types: 'poi',
        limit: '1',
        country: countryCode.toLowerCase()
      });
  
      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return {
          latitude: data.features[0].center[1],
          longitude: data.features[0].center[0]
        };
      }
      throw new Error(`Port ${location} (${portName}) found in UN/LOCODE but coordinates not available`);
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Port ${location} found but geocoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

      throw new Error(`Port ${location} not found in UN/LOCODE database`);
    } else {
      const result = await searchPostalLocation(location, 'US');
      if (result.locations.length === 0) {
        throw new Error(`Postal location ${location} not found`);
      }
      return result.locations[0].coordinates;
    }
  } catch (error) {
    console.error(`Error getting coordinates for ${locationType} location ${location}:`, error);
    throw error;
  }
} 