export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ports-index-backend.vercel.app';
export const API_ENDPOINTS = {
  TEST_CONNECTION: '/api/test-connection',
  FIND_PORT: (locode: string) => `/api/ports/${locode}`,
  SEARCH_PORTS: '/api/ports'
} as const; 