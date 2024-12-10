import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;
  
  if (!targetUrl) {
    console.error('Missing URL parameter');
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log('Fetching URL:', targetUrl);

  const agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
  });

  try {
    const response = await fetch(targetUrl, {
      agent,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Connection': 'keep-alive'
      },
      timeout: 15000
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    
    return res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      targetUrl,
      timestamp: new Date().toISOString()
    });

    return res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 