import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0',
        'Origin': window.location.origin
      }
    });

    if (!response.ok) {
      console.error(`Upstream server error: ${response.status}`);
      throw new Error(`Upstream server responded with ${response.status}`);
    }

    const data = await response.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error',
      url: targetUrl
    });
  }
} 