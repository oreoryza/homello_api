export default async function handler(req, res) {
  const { id } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*'); // bisa diganti domain Webflow kamu
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ✅ HANDLE PREFLIGHT (penting!)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();

    const response = await fetch(`https://api.hostaway.com/v1/listings/${id}?includeResources=*`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}