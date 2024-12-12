import { env } from '../config/env';
import { PortData } from '../types/port';

export async function getPortCoordinates(port: PortData): Promise<{ latitude: number; longitude: number } | null> {
  // If port has coordinates in database, use those
  if (port.latitude && port.longitude) {
    return {
      latitude: port.latitude,
      longitude: port.longitude
    };
  }

  // Fallback to Mapbox geocoding
  try {
    const mapboxToken = env.MAPBOX_TOKEN;
    if (!mapboxToken) {
      throw new Error('Mapbox token not configured');
    }

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(port.name)}.json`;
    const params = new URLSearchParams({
      access_token: mapboxToken,
      types: 'poi',
      limit: '1',
      country: port.countryCode.toLowerCase()
    });

    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch location data');
    
    const data = await response.json();
    if (data.features?.[0]?.center) {
      return {
        latitude: data.features[0].center[1],
        longitude: data.features[0].center[0]
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export const formatCoordinates = (latitude: number, longitude: number): string => {
  // Convert decimal degrees to DDMM format
  const latDeg = Math.abs(Math.floor(latitude));
  const latMin = Math.abs(Math.floor((latitude % 1) * 60));
  const latDir = latitude >= 0 ? 'N' : 'S';

  const lonDeg = Math.abs(Math.floor(longitude));
  const lonMin = Math.abs(Math.floor((longitude % 1) * 60));
  const lonDir = longitude >= 0 ? 'E' : 'W';

  return `${latDeg.toString().padStart(2, '0')}${latMin.toString().padStart(2, '0')}${latDir} ${lonDeg.toString().padStart(3, '0')}${lonMin.toString().padStart(2, '0')}${lonDir}`;
};

export const parseCoordinates = (coordString: string): { latitude: number; longitude: number } => {
  try {
    const [latPart, lonPart] = coordString.trim().split(' ');
    
    const latDeg = parseInt(latPart.slice(0, 2));
    const latMin = parseInt(latPart.slice(2, 4));
    const latDir = latPart.slice(-1);
    
    const lonDeg = parseInt(lonPart.slice(0, 3));
    const lonMin = parseInt(lonPart.slice(3, 5));
    const lonDir = lonPart.slice(-1);
    
    const latitude = (latDeg + latMin / 60) * (latDir === 'S' ? -1 : 1);
    const longitude = (lonDeg + lonMin / 60) * (lonDir === 'W' ? -1 : 1);
    
    return { latitude, longitude };
  } catch (error) {
    throw new Error('Invalid coordinate format');
  }
}; 