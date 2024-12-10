import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  isDark: boolean;
  markers: Array<{
    coordinates: [number, number];
    color?: string;
  }>;
  path?: Array<[number, number]>;
}

export const Map: React.FC<MapProps> = ({ isDark, markers, path }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: isDark 
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5
    });

    markers.forEach(marker => {
      new mapboxgl.Marker({ color: marker.color || '#FF0000' })
        .setLngLat(marker.coordinates)
        .addTo(map);
    });

    if (path && path.length > 1) {
      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: path
            }
          }
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#2563eb',
            'line-width': 3
          }
        });
      });
    }

    return () => map.remove();
  }, [isDark, markers, path]);

  return <div id="map" className="w-full h-full rounded-lg" />;
}; 