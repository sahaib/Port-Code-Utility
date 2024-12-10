import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const ALLOWED_ORIGINS = [
  'https://port-code-utility.vercel.app',
  'https://portsindex.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const origin = req.headers.origin || '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  const targetUrl = req.query.url as string;
  if (!targetUrl || !targetUrl.startsWith('https://service.unece.org')) {
    return res.status(400).json({ error: 'Invalid target URL' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const signal = controller.signal as any;

    const response = await fetch(targetUrl, {
      signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Port-Code-Utility/1.0',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
} 