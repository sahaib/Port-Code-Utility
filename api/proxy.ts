import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

// Constants
const ALLOWED_ORIGINS = [
  'https://port-code-utility.vercel.app/',
  'https://portsindex.com',
  'https://www.portsindex.com',
  'http://localhost:3001'
];

/**
 * Proxy Handler
 * @param req - Vercel Request object
 * @param res - Vercel Response object
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;

  // Validate CORS
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  } else {
    return res.status(403).json({ error: 'Forbidden origin' });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate request method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate target URL
  const targetUrl = req.query.url as string;
  if (!targetUrl || !targetUrl.startsWith('https://service.unece.org')) {
    return res.status(400).json({ error: 'Invalid or missing target URL' });
  }

  try {
    // Fetch data from the target URL
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; PortIndex/1.0)',
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Forward the response
    const data = await response.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
