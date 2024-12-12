interface ImportMetaEnv {
  VITE_MAPBOX_TOKEN: string;
  VITE_DATABASE_URL: string;
  VITE_CACHE_EXPIRATION_TIME: string;
  MODE: string;
}

const getEnvVar = (key: keyof ImportMetaEnv, fallback = ''): string => {
  if (!import.meta.env[key]) {
    console.warn(`⚠️ Environment variable ${key} is not defined`);
  }
  return import.meta.env[key] || fallback;
};

export const env = {
  MAPBOX_TOKEN: getEnvVar('VITE_MAPBOX_TOKEN'),
  DATABASE_URL: getEnvVar('VITE_DATABASE_URL'),
  CACHE_EXPIRATION_TIME: parseInt(getEnvVar('VITE_CACHE_EXPIRATION_TIME', '3600000'), 10),
  NODE_ENV: import.meta.env.MODE || 'development'
} as const;

// Validate required environment variables
const requiredEnvVars = ['MAPBOX_TOKEN'] as const;

for (const key of requiredEnvVars) {
  if (!env[key]) {
    console.warn(`⚠️ ${key} is not configured`);
  }
} 