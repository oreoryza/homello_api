export default async function handler(req, res) {
  const {
    availabilityDateStart,
    availabilityDateEnd,
    availabilityGuestNumber
  } = req.query;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. get token
    const tokenRes = await fetch(`${process.env.BASE_URL}/api/token`);
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. get listings (filtered)
    const listingRes = await fetch(
      `https://api.hostaway.com/v1/listings?includeResources=1&availabilityDateStart=${availabilityDateStart}&availabilityDateEnd=${availabilityDateEnd}&availabilityGuestNumber=${availabilityGuestNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const listingData = await listingRes.json();

    const listings = listingData?.result || [];

    // 3. enrich each listing with priceDetails
    const enrichedListings = await Promise.all(
      listings.map(async (listing) => {
        try {
          const priceRes = await fetch(
            `https://booking-engine.hostaway.com/bookingEngines/homello/listings/${listing.id}/calendar/priceDetails`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                startingDate: availabilityDateStart,
                endingDate: availabilityDateEnd,
                numberOfGuests: Number(availabilityGuestNumber),
                version: 2
              })
            }
          );

          const priceData = await priceRes.json();

          return {
            ...listing,
            priceDetails: priceData
          };
        } catch (err) {
          return {
            ...listing,
            priceDetails: null,
            priceError: err.message
          };
        }
      })
    );

    return res.status(200).json({
      ...listingData,
      result: enrichedListings
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}