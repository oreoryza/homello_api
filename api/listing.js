export default async function handler(req, res) {
  const { id, start, end } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 🔑 ambil token
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();

    const headers = {
      Authorization: `Bearer ${tokenData.access_token}`
    };

    // 🔥 listing
    const listingPromise = fetch(
      `https://api.hostaway.com/v1/listings/${id}?includeResources=1&attachObjects[]=bookingEngineUrls`,
      { headers }
    );

    // 🔥 calendar (availability)
    let calendarUrl = `https://api.hostaway.com/v1/listings/${id}/calendar`;

    // optional filter tanggal
    if (start && end) {
      calendarUrl += `?startDate=${start}&endDate=${end}`;
    }

    const calendarPromise = fetch(calendarUrl, { headers });

    // 🚀 paralel
    const [listingRes, calendarRes] = await Promise.all([
      listingPromise,
      calendarPromise
    ]);

    const listingData = await listingRes.json();
    const calendarData = await calendarRes.json();

    res.status(200).json({
      listing: listingData,
      calendar: calendarData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}