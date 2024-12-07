const express = require("express");
const Location = require("../models/Location.js");

const LocationRouter = express.Router();

const getLatLngFromAddress = async (address) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    } else {
      console.error("Geocoding API Error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
};

LocationRouter.get("/nearbyLocations/:lat/:lng/:type", async (req, res) => {
  try {
    const options = { method: "GET", headers: { accept: "application/json" } };
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const typ = req.params.type;
    const radius = 10; // Radius in km

    // Function to fetch locations with varied lat/lng
    const fetchLocations = async (latOffset, lngOffset) => {
      const response = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${
          lat + latOffset
        }%2C${lng + lngOffset}&language=en&key=${
          process.env.TRIPADV_KEY
        }&category=${typ}&radius=${radius}&radiusUnit=km`,
        options
      );
      const data = await response.json();
      if (data.data) {
        return data.data.filter((location) => location.distance !== "0.0"); // Ensure distance is not 0
      }
      return [];
    };

    // Fetch nearby locations from API
    const results1 = await fetchLocations(0, 0); // Original coordinates
    const results2 = await fetchLocations(0.05, 0); // Slightly adjusted latitude
    const results3 = await fetchLocations(0, 0.05); // Slightly adjusted longitude

    // Combine and deduplicate results by location_id
    const allResults = [...results1, ...results2, ...results3];
    const locationIds = [
      ...new Set(allResults.map((location) => location.location_id)),
    ];

    // Helper function to check if a location is "good"
    const isGoodLocation = async (locationID) => {
      // Check if location already exists in the database
      const existingLocation = await Location.findOne({
        locationId: locationID,
      });
      if (existingLocation) {
        // Verify it has at least one photo
        return existingLocation.photos.length > 0;
      }

      // If not in database, fetch details
      const locationDetailsResponse = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/${locationID}/details?language=en&currency=USD&key=${process.env.TRIPADV_KEY}`,
        options
      );
      const locationDetails = await locationDetailsResponse.json();

      // Geocode address to get lat/lng
      if (
        locationDetails.address_obj &&
        locationDetails.address_obj.address_string
      ) {
        const addressString = locationDetails.address_obj.address_string;
        const geocodedLocation = await getLatLngFromAddress(addressString);
        if (geocodedLocation) {
          locationDetails.latitude = geocodedLocation.latitude;
          locationDetails.longitude = geocodedLocation.longitude;
        }
      }

      // Fetch additional location data (photos and reviews)
      const locationPhotosResponse = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/${locationID}/photos?language=en&key=${process.env.TRIPADV_KEY}`,
        options
      );
      const locationPhotosData = await locationPhotosResponse.json();
      const photos = locationPhotosData.data;

      const locationReviewsResponse = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/${locationID}/reviews?language=en&key=${process.env.TRIPADV_KEY}`,
        options
      );
      const locationReviewsData = await locationReviewsResponse.json();
      const reviews = locationReviewsData.data;

      // Only save location if it has photos
      if (photos.length > 0) {
        const location = new Location({
          locationId: locationID,
          locationDetails,
          photos,
          reviews,
        });
        await location.save();
        return true;
      }

      return false;
    };

    const goodLocations = [];
    for (const locationID of locationIds) {
      if (await isGoodLocation(locationID)) {
        const location = await Location.findOne({ locationId: locationID });
        goodLocations.push(location);
      }
    }

    console.log(goodLocations.length);
    res.status(200).json(goodLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch nearby good locations" });
  }
});

module.exports = LocationRouter;
