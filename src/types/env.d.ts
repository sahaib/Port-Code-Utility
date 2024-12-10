interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  readonly VITE_MAPBOX_TOKEN?: string;
  plausible?: (eventName: string, options?: { props: Record<string, any> }) => void;
} 