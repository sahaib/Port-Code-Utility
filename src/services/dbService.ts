import { PortData } from '../types/port';
import { formatCoordinates } from '../utils/coordinateUtils';

const API_URL = 'https://ports-index-backend.vercel.app/api';

export const findPortByLocode = async (locode: string): Promise<PortData | null> => {
  const response = await fetch(`${API_URL}/ports/${locode}`);
  if (!response.ok) return null;
  const port = await response.json();
  return port ? { ...port, coordinates: formatCoordinates(port.latitude, port.longitude) } : null;
};

export const searchPortsByName = async (name: string, countryCode: string): Promise<PortData[]> => {
  const response = await fetch(`${API_URL}/ports?name=${name}&countryCode=${countryCode}`);
  if (!response.ok) return [];
  const ports = await response.json();
  return ports.map((port: PortData) => ({ ...port, coordinates: formatCoordinates(port.latitude, port.longitude) }));
}; 