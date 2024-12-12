import { findPortByLocode, searchPortsByName } from './dbService';
import { logger } from '../utils/logger';
import { PortResponse, PortData } from '../types/port';
import { SearchOptions } from '../types/search';

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