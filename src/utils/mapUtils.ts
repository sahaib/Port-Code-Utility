interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const getBounds = (coordinates: Array<{ latitude: number; longitude: number }>): Bounds => {
  const lats = coordinates.map(coord => coord.latitude);
  const lngs = coordinates.map(coord => coord.longitude);
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  };
};

export const getZoomLevel = (bounds: Bounds): number => {
  const latDiff = bounds.north - bounds.south;
  const lngDiff = bounds.east - bounds.west;
  const maxDiff = Math.max(latDiff, lngDiff);
  
  // Base zoom calculation on the larger difference
  // Add padding and limit max zoom
  return Math.min(Math.floor(8 - Math.log2(maxDiff)), 10);
}; 