import { findPortByLocode, searchPortsByName } from './dbService';
import { logger } from '../utils/logger';
import { PortResponse, PortData } from '../types/port';
import { SearchOptions } from '../types/search';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export const fetchPortData = async (searchOptions: SearchOptions): Promise<PortResponse> => {
  const { value, type, countryCode } = searchOptions;

  if (!value || !countryCode) {
    throw new Error('Value and country code are required');
  }

  try {
    let ports: PortData[] = [];
    
    if (type === 'locode') {
      const port = await findPortByLocode(value.toUpperCase());
      if (port) {
        ports = [port];
      }
    } else {
      ports = await searchPortsByName(value, countryCode);
    }

    return {
      ports,
      country: countryCode.toUpperCase()
    };

  } catch (error) {
    logger.error('Port fetch error:', { message: error instanceof Error ? error.message : String(error) });
    throw error instanceof Error ? error : new Error('Failed to fetch port data');
  }
};

export const findNearbyPorts = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 30
): Promise<PortData[]> => {
  try {
    console.log('Requesting nearby ports:', { latitude, longitude, radiusKm });

    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      radius: radiusKm.toString()
    });

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NEARBY_PORTS}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      throw new Error(`Failed to fetch nearby ports: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.ports) ? data.ports : [];

  } catch (error) {
    console.error('Nearby ports fetch error:', error);
    throw new Error('Failed to fetch nearby ports');
  }
};