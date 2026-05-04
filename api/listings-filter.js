export default async function handler(req, res) {
  const { availabilityDateStart } = req.query;
  const { availabilityDateEnd } = req.query;
  const { availabilityGuestNumber } = req.query;

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
    const response = await fetch(`https://api.hostaway.com/v1/listings?availabilityDateStart=${availabilityDateStart}&availabilityDateEnd=${availabilityDateEnd}&availabilityGuestNumber=${availabilityGuestNumber}`, {
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