export default async function handler(req, res) {
  const tokenRes = await fetch('https://api.hostaway.com/v1/accessTokens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: '167223',
    client_secret: '8474ddb77167d0f5aebdf00aac4c9cf71c4d1a35f57bc42e05cd649a3b99f683'
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