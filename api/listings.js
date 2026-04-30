export default async function handler(req, res) {
  try {
    // STEP 1: ambil token dulu
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();

    const accessToken = tokenData.access_token;

    // STEP 2: call Hostaway API
    const response = await fetch('https://api.hostaway.com/v1/listings', {
      method: 'GET',
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