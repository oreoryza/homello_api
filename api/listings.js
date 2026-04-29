export default async function handler(req, res) {
  const tokenRes = await fetch('https://api.hostaway.com/v1/accessTokens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.HOSTAWAY_ACCOUNT_ID,
    client_secret: process.env.HOSTAWAY_API_KEY
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