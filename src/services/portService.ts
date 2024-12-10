import { BASE_URL, PROXY_URL } from "../config/constants";
import { parseHtmlTable } from "../utils/htmlParser";
import { PortResponse } from '../types/port';
import { SearchOptions } from '../types/search';

export const fetchPortData = async (searchOptions: SearchOptions): Promise<PortResponse> => {
  const { value, type, countryCode } = searchOptions;

  if (type === 'locode' && (!value || value.length !== 5)) {
    throw new Error('Invalid LOCODE format');
  }

  if (!countryCode) {
    throw new Error('Country code is required');
  }

  const url = `${PROXY_URL}${encodeURIComponent(`${BASE_URL}/${countryCode.toLowerCase()}.htm`)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0',
        'Origin': 'http://localhost:5173'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const ports = parseHtmlTable(html);
    
    const filteredPorts = type === 'locode' 
      ? ports.filter(port => port.locode === value.toUpperCase())
      : ports.filter(port => 
          port.name.toLowerCase().includes(value.toLowerCase()) ||
          port.nameWoDiacritics.toLowerCase().includes(value.toLowerCase())
        );

    return { 
      ports: filteredPorts.slice(0, 10), // Limit results for name search
      country: countryCode.toUpperCase() 
    };
  } catch (error) {
    console.error('Error fetching port data:', error);
    throw new Error('Failed to fetch port data. Please try again later.');
  }
};