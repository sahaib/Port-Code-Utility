import { BASE_URL, PROXY_URL } from "../config/constants";
import { parseHtmlTable } from "../utils/htmlParser";
import { PortData, PortResponse } from '../types/port';
import { SearchOptions } from '../types/search';

const countryDataCache: Record<string, { 
  html: string;
  parsedPorts: PortData[];
  timestamp: number 
}> = {};
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours for country data

export const fetchPortData = async (searchOptions: SearchOptions): Promise<PortResponse> => {
  const { value, type, countryCode } = searchOptions;

  if (!countryCode) {
    throw new Error('Country code is required');
  }

  const countryKey = countryCode.toLowerCase();
  const cachedData = countryDataCache[countryKey];
  let ports: PortData[];
  
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    ports = cachedData.parsedPorts;
  } else {
    const url = `${PROXY_URL}${encodeURIComponent(`${BASE_URL}/${countryCode.toLowerCase()}.htm`)}`;
    console.log('Requesting URL:', url); // Debug log

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const countryHtml = await response.text();
      ports = parseHtmlTable(countryHtml);
      
      // Cache the results
      countryDataCache[countryKey] = {
        html: countryHtml,
        parsedPorts: ports,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  if (type === 'locode') {
    const exactMatch = ports.find(port => port.locode === value.toUpperCase());
    return {
      ports: exactMatch ? [exactMatch] : [],
      country: countryCode.toUpperCase()
    };
  }

  const searchTerm = value.toLowerCase();
  const filteredPorts = ports.filter(port => 
    port.name.toLowerCase().includes(searchTerm) ||
    port.nameWoDiacritics.toLowerCase().includes(searchTerm)
  ).slice(0, 10);

  return {
    ports: filteredPorts,
    country: countryCode.toUpperCase()
  };
};

export const clearCountryCache = () => {
  Object.keys(countryDataCache).forEach(key => {
    if (Date.now() - countryDataCache[key].timestamp > CACHE_DURATION) {
      delete countryDataCache[key];
    }
  });
};