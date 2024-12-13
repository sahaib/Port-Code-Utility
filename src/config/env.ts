import { z } from 'zod';

const envSchema = z.object({
  MAPBOX_TOKEN: z.string().min(1, 'Mapbox token is required'),
});

export const env = {
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN,
} as const;

// Validate environment variables
try {
  envSchema.parse(env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error);
} 