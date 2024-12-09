import { PortData } from '../types/port';

const extractCellContent = (cell: HTMLTableCellElement | null): string => {
  try {
    return cell?.textContent?.trim().replace(/&nbsp;/g, '').trim() || '';
  } catch {
    return '';
  }
};

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
    const dataRows = rows.slice(1);
    
    const ports = dataRows
      .map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells.length < 10) return null;

        const locodeCell = extractCellContent(cells[1]);
        if (!locodeCell) return null;

        // Get country code from the LOCODE itself
        const countryCode = locodeCell.slice(0, 2);
        const locodePart = locodeCell.slice(2).trim();

        return {
          locode: `${countryCode}${locodePart}`,
          name: extractCellContent(cells[2]),
          nameWoDiacritics: extractCellContent(cells[3]),
          subdivision: extractCellContent(cells[4]),
          function: extractCellContent(cells[5]),
          status: extractCellContent(cells[6]),
          date: extractCellContent(cells[7]),
          iata: extractCellContent(cells[8]),
          coordinates: extractCellContent(cells[9]),
          remarks: extractCellContent(cells[10])
        };
      })
      .filter((port): port is PortData => 
        port !== null && 
        port.locode.length === 5
      );

    return ports;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return [];
  }
};