export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests for the actual API call
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const serverUrl = process.env.SERVER_URL || 'https://haizadtarik--vton-ootd-flux-vtonserver-fastapi-app.modal.run';
    
    console.log('Forwarding request to:', `${serverUrl}/viton`);
    console.log('Request body keys:', Object.keys(req.body));
    
    // Forward the request to your Modal server's /viton endpoint
    const response = await fetch(`${serverUrl}/viton`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('Modal response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Modal API Error:', errorData);
      return res.status(response.status).json({ 
        error: `Server request failed with status ${response.status}`,
        details: errorData 
      });
    }

    const result = await response.json();
    console.log('Successfully received response from Modal API');
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
