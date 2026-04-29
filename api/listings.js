export default async function handler(req, res) {
  const tokenRes = await fetch('https://api.hostaway.com/v1/accessTokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId: import.meta.env.HOSTAWAY_ACCOUNT_ID,
      apiKey: import.meta.env.HOSTAWAY_API_KEY              
    })
  });

  const { accessToken } = await tokenRes.json();

  const listingsRes = await fetch('https://api.hostaway.com/v1/listings', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await listingsRes.json();

  res.status(200).json(data);
}