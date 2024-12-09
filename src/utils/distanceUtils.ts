interface Coordinates {
  latitude: number;
  longitude: number;
}

export const parseCoordinates = (coordString: string): Coordinates => {
  try {
    // Remove any whitespace and split
    const parts = coordString.trim().split(/\s+/);
    if (!parts || parts.length !== 2) {
      console.error('Invalid parts:', parts);
      throw new Error('Invalid coordinate format');
    }

    const lat = parts[0].trim();
    const long = parts[1].trim();

    // Debug logging
    console.log('Parsing coordinates:', { lat, long });

    // Strict format check (e.g., "1305N 08017E")
    if (!/^\d{4}[NS]$/.test(lat) || !/^\d{5}[EW]$/.test(long)) {
      throw new Error('Invalid coordinate format');
    }

    const latDeg = parseInt(lat.slice(0, 2));
    const latMin = parseInt(lat.slice(2, 4));
    const latDir = lat.slice(-1);

    const longDeg = parseInt(long.slice(0, 3));
    const longMin = parseInt(long.slice(3, 5));
    const longDir = long.slice(-1);

    const latitude = latDeg + (latMin / 60);
    const longitude = longDeg + (longMin / 60);

    return {
      latitude: latDir === 'S' ? -latitude : latitude,
      longitude: longDir === 'W' ? -longitude : longitude
    };
  } catch (error) {
    console.error('Coordinate parsing error:', coordString);
    throw new Error('Invalid coordinate format');
  }
};

export const calculateDistance = (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): number => {
  const R = 3440.065; // Earth's radius in nautical miles
  const φ1 = (origin.latitude * Math.PI) / 180;
  const φ2 = (destination.latitude * Math.PI) / 180;
  const Δφ = ((destination.latitude - origin.latitude) * Math.PI) / 180;
  const Δλ = ((destination.longitude - origin.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}; 