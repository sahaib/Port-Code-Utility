export interface CSVRow {
    origin: string;
    originCountry: string;
    destination: string;
    destinationCountry: string;
    type: 'port-to-port' | 'port-to-door' | 'door-to-port' | 'door-to-door';
  }

export const parseCSV = async (file: File): Promise<CSVRow[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].toLowerCase().split(',');
  
  // Validate headers
  const requiredHeaders = ['origin', 'origincountry', 'destination', 'destinationcountry', 'type'];
  const hasAllHeaders = requiredHeaders.every(header => 
    headers.some(h => h.trim() === header)
  );
  
  if (!hasAllHeaders) {
    throw new Error('Invalid CSV format. Please use the template provided.');
  }

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      return {
        origin: values[0],
        originCountry: values[1],
        destination: values[2],
        destinationCountry: values[3],
        type: values[4] as 'port-to-port' | 'port-to-door' | 'door-to-port' | 'door-to-door'
      };
    });
};

export const validateCSVData = (data: CSVRow[]): string[] => {
    const errors: string[] = [];
    const validTypes = ['port-to-port', 'port-to-door', 'door-to-port', 'door-to-door'];
  
    data.forEach((row, index) => {
      const lineNumber = index + 2;
  
      if (!validTypes.includes(row.type)) {
        errors.push(`Line ${lineNumber}: Invalid type "${row.type}". Must be one of: ${validTypes.join(', ')}`);
      }
  
      if (!row.origin || !row.destination) {
        errors.push(`Line ${lineNumber}: Missing origin or destination`);
      }
  
      if (!row.originCountry || !row.destinationCountry) {
        errors.push(`Line ${lineNumber}: Missing country code`);
      }
  
      // Validate LOCODE format for ports
      if (row.type.startsWith('port-') && !/^[A-Z]{2}[A-Z0-9]{3}$/.test(row.origin)) {
        errors.push(`Line ${lineNumber}: Invalid port LOCODE format for origin "${row.origin}"`);
      }
  
      if (row.type.endsWith('-port') && !/^[A-Z]{2}[A-Z0-9]{3}$/.test(row.destination)) {
        errors.push(`Line ${lineNumber}: Invalid port LOCODE format for destination "${row.destination}"`);
      }
    });
  
    return errors;
  };