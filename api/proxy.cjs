const { VercelRequest, VercelResponse } = require('@vercel/node');
const nodeFetch = require('node-fetch');
const https = require('https');

module.exports = async function handler(req, res) {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    const response = await nodeFetch(targetUrl, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await response.text();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
} 