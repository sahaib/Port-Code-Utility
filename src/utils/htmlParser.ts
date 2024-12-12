import { PortData } from '../types/port';

export const parseHtmlTable = (html: string): PortData[] => {
  if (!html) {
    throw new Error('Empty HTML content received');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table[border="1"][cellpadding="1"]');
    
    if (!table) {
      console.error('Table not found in HTML');
      return [];
    }

    const rows = Array.from(table.querySelectorAll('tr'));
    const dataRows = rows.slice(1); // Skip header row
    
    return dataRows
      .map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells.length < 11) return null;

        const countryCode = cells[1]?.textContent?.slice(0, 2) || '';
        const locodePart = cells[1]?.textContent?.slice(2).trim() || '';
        
        if (!countryCode || !locodePart) return null;

        // Extract coordinates in the exact format shown in Prisma Studio
        const coordText = cells[9]?.textContent?.trim() || '';
        const [latStr, lonStr] = coordText.split(' ').map(c => c.trim());
        
        // Parse coordinates to match the database format (e.g., 32.86666666666667)
        const latitude = parseFloat(latStr) || 0;
        const longitude = parseFloat(lonStr) || 0;

        return {
          id: `cm4juk${Math.random().toString(36).substr(2, 8)}`, // Generate an ID similar to the database
          locode: `${countryCode}${locodePart}`,
          name: cells[2]?.textContent?.trim() || '',
          nameWoDiacritics: cells[3]?.textContent?.trim() || null,
          latitude,
          longitude,
          countryCode,
          function: cells[5]?.textContent?.trim() || '---3-----',  // Default function code
          status: cells[6]?.textContent?.trim() || 'RL',          // Default status
          subdivision: cells[4]?.textContent?.trim() || null,
          iata: cells[8]?.textContent?.trim() || null,
          remarks: cells[10]?.textContent?.trim() || null,
          unlocodeDate: cells[7]?.textContent?.trim() || null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
      .filter((port): port is PortData => 
        port !== null && 
        typeof port === 'object' &&
        typeof port.locode === 'string' &&
        port.locode.length === 5
      );
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return [];
  }
};