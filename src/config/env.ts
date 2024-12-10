interface EnvConfig {
  MAPBOX_TOKEN: string;
}

const getEnvConfig = (): EnvConfig => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  
  if (!token) {
    throw new Error('VITE_MAPBOX_TOKEN is required but not configured');
  }
  
  return {
    MAPBOX_TOKEN: token
  };
};

export const env = getEnvConfig(); 