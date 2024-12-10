import { VercelRequest, VercelResponse } from '@vercel/node';
import { REQUEST_HEADERS } from '../src/config/constants';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, User-Agent');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = req.query.url as string;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log('Fetching:', targetUrl);
    
    const response = await fetch(targetUrl, {
      headers: REQUEST_HEADERS
    });

    if (!response.ok) {
      console.error(`Upstream server error: ${response.status}`);
      throw new Error(`Upstream server responded with ${response.status}`);
    }

    const data = await response.text();
    
    // Set content type and send response
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error',
      url: targetUrl // Add the URL to help with debugging
    });
  }
} 