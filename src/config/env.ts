interface EnvConfig {
  MAPBOX_TOKEN: string;
}

const getEnvConfig = (): EnvConfig => {
  const envConfig = {
    MAPBOX_TOKEN: window.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_TOKEN
  };

  return envConfig;
};

export const env = getEnvConfig(); 