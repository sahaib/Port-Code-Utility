declare global {
  interface Window {
    VITE_MAPBOX_TOKEN?: string;
    plausible?: (eventName: string, options?: { props: Record<string, any> }) => void;
  }
}

export {}; 