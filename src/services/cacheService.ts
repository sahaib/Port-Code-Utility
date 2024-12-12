import { PortData } from '../types/port';
import { logger } from '../utils/logger';

interface PortCache {
  [countryCode: string]: {
    ports: PortData[];
    timestamp: number;
  };
}

interface LocodeCache {
  [locode: string]: {
    port: PortData;
    timestamp: number;
  };
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const portCache: PortCache = {};
const locodeCache: LocodeCache = {};

export const getCachedPort = (locode: string): PortData | null => {
  const cached = locodeCache[locode];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.debug(`Cache hit for locode: ${locode}`);
    return cached.port;
  }
  return null;
};

export const setCachedPort = (port: PortData): void => {
  locodeCache[port.locode] = {
    port,
    timestamp: Date.now()
  };
  logger.debug(`Cached port: ${port.locode}`);
};

export const getCachedPorts = (countryCode: string): PortData[] | null => {
  const cached = portCache[countryCode];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.debug(`Cache hit for country: ${countryCode}`);
    return cached.ports;
  }
  return null;
};

export const setCachedPorts = (countryCode: string, ports: PortData[]): void => {
  portCache[countryCode] = {
    ports,
    timestamp: Date.now()
  };
  logger.debug(`Cached ${ports.length} ports for country: ${countryCode}`);
};

export const clearCache = (): void => {
  Object.keys(portCache).forEach(key => delete portCache[key]);
  Object.keys(locodeCache).forEach(key => delete locodeCache[key]);
  logger.info('Cache cleared');
}; 