export default async function handler(req, res) {
  // =========================
  // CORS
  // =========================
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // =========================
    // BODY FROM FRONTEND
    // =========================
    const {
      listingMapId,
      checkInDate,
      checkOutDate,

      guestName,
      guestFirstName,
      guestLastName,
      guestEmail,
      phone,

      numberOfGuests,

      totalPrice,

      guestNote,

      financeField
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!listingMapId) {
      return res.status(400).json({
        success: false,
        message: 'listingMapId required'
      });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'checkInDate and checkOutDate required'
      });
    }

    if (!guestName || !guestEmail) {
      return res.status(400).json({
        success: false,
        message: 'guestName and guestEmail required'
      });
    }

    // =========================
    // HOSTAWAY TOKEN
    // =========================
    const HOSTAWAY_TOKEN = process.env.HOSTAWAY_TOKEN;

    // =========================
    // REQUEST BODY
    // =========================
    const payload = {
      channelId: 2000,

      listingMapId,

      status: 'new',

      arrivalDate: checkInDate,
      departureDate: checkOutDate,

      guestName,
      guestFirstName,
      guestLastName,

      guestEmail,
      phone,

      numberOfGuests: numberOfGuests || 1,

      totalPrice: totalPrice || 0,

      currency: 'NZD',

      guestNote: guestNote || '',

      financeField,

      isManuallyChecked: 0,
      isInitial: 0
    };

    // ambil token
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // =========================
    // CREATE RESERVATION
    // =========================
    const response = await fetch(
      'https://api.hostaway.com/v1/reservations',
      {
        method: 'POST',
        headers: {
          Authorization : `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // =========================
    // ERROR FROM HOSTAWAY
    // =========================
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        hostaway: data
      });
    }

    // =========================
    // SUCCESS
    // =========================
    return res.status(200).json({
      success: true,
      reservation: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}