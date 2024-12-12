import { PortData } from '../types/port';

const API_URL = 'https://ports-index-backend.vercel.app';

export async function findPortByLocode(locode: string): Promise<PortData | null> {
  const response = await fetch(`${API_URL}/ports/${locode}`);
  if (!response.ok) return null;
  return response.json();
}

export async function searchPortsByName(name: string, countryCode: string): Promise<PortData[]> {
  const response = await fetch(`${API_URL}/ports?name=${name}&countryCode=${countryCode}`);
  if (!response.ok) return [];
  return response.json();
} 