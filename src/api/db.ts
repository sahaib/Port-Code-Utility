const API_URL = 'https://ports-index-backend.vercel.app/api';

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/test-connection`);
    const data = await response.json();
    return data.connected;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}; 