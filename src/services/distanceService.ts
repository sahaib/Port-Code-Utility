import { BulkCalculationRow, BulkCalculationResult, ProcessingStats } from '../types/bulk';
import { searchPostalLocation } from './locationService';
import { fetchPortData } from './portService';
import { calculateDistance } from '../utils/distanceUtils';
import { logger } from '../utils/logger';
import { env } from '../config/env';

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

      if (portData.ports.length > 0) {
        const port = portData.ports[0];
        const mapboxToken = env.MAPBOX_TOKEN;
        
        if (!mapboxToken) {
          throw new Error('Mapbox token not configured');
        }

        // Try multiple search strategies
        const searchQueries = [
          `port of ${port.name}`, // Try with "port of" prefix
          `${port.name} port`,    // Try with "port" suffix
          port.name,              // Try just the name
          `${port.name} ${countryCode}` // Try with country code
        ];

        for (const query of searchQueries) {
          const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
          const params = new URLSearchParams({
            access_token: mapboxToken,
            types: 'place,poi,locality',
            limit: '1',
            country: countryCode.toLowerCase()
          });

          const response = await fetch(`${endpoint}?${params}`);
          if (!response.ok) continue;
          
          const data = await response.json();
          if (data.features?.[0]?.center) {
            return {
              latitude: data.features[0].center[1],
              longitude: data.features[0].center[0]
            };
          }
        }
      }

      throw new Error(`Port ${location} not found or coordinates unavailable`);
    } else {
      const result = await searchPostalLocation(location, 'US');
      return result.locations[0]?.coordinates || null;
    }
  } catch (error) {
    logger.error(`Error getting coordinates for ${locationType} location ${location}:`, { error });
    throw error;
  }
} 