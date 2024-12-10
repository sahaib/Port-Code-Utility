interface EnvConfig {
  MAPBOX_TOKEN: string;
}

const getEnvConfig = (): EnvConfig => {
  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    throw new Error('VITE_MAPBOX_TOKEN is required but not configured');
  }
  
  return {
    MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN
  };
};

export const env = getEnvConfig(); 