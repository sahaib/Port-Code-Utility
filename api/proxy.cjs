const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
} 