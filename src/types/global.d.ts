declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props: Record<string, any> }) => void;
    VITE_MAPBOX_TOKEN?: string;
  }
}

export {}; 