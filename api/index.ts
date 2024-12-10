import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    res.status(200).json({ message: 'API is working!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to handle request' });
  }
}