const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token not configured. Please set VITE_MAPBOX_TOKEN in your environment variables.');
}

export const getMapboxToken = () => MAPBOX_TOKEN; 