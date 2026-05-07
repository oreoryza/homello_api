export default async function handler(req, res) {
  const { listingId, start, end, guests } = req.query;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ambil token
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // ✅ CALL endpoint yang benar
    const response = await fetch(`https://booking-engine.hostaway.com/bookingEngines/homello/listings/${listingId}/calendar/priceDetails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startingDate: start,
        endingDate: end,
        numberOfGuests: Number(guests),
        version: 2
      })
    });

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}