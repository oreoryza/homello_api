export default async function handler(req, res) {
  try {
    const tokenRes = await fetch('https://api.hostaway.com/v1/accessTokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accountId: process.env.HOSTAWAY_ACCOUNT_ID,
        apiKey: process.env.HOSTAWAY_API_KEY
      })
    });

    const tokenData = await tokenRes.json();
    console.log("TOKEN RESPONSE:", tokenData);

    if (!tokenData.accessToken) {
      return res.status(400).json(tokenData);
    }

    const listingsRes = await fetch('https://api.hostaway.com/v1/listings', {
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`
      }
    });

    const data = await listingsRes.json();

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}