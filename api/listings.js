// api/listings.js
export default async function handler(req, res) {
  // 1. Set CORS headers so Webflow can call this function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // 2. Exchange your API credentials for an Access Token
    const authResponse = await fetch('https://api.hostaway.com/v1/accessTokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.HOSTAWAY_ACCOUNT_ID,
        client_secret: process.env.HOSTAWAY_API_KEY,
        scope: 'general'
      })
    });

    const { access_token } = await authResponse.json();

    // 3. Use the token to fetch your Hostaway listings
    const listingsResponse = await fetch('https://hostaway.com', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Cache-Control': 'no-cache'
      }
    });

    const data = await listingsResponse.json();
    
    // 4. Return the data to Webflow
    return res.status(200).json(data.result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
