export default async function handler(req, res) {
    const { listingId, start, end, guests } = req.query;

  // ✅ HANDLE CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // bisa diganti domain Webflow kamu
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ✅ HANDLE PREFLIGHT (penting!)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ambil token
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // call Hostaway
    const response = await fetch(`https://booking-engine.hostaway.com/bookingEngines/homello/listings/${listingId}/calendar/priceDetails?start=${start}&end=${end}&numberOfGuests=${guests}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}