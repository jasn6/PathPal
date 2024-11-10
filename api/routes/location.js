const express = require("express");
const Location = require("../models/Location.js");

const LocationRouter = express.Router();

LocationRouter.get("/nearbyLocations/:lat/:lng", async (req, res) => {
  try {
    const options = { method: "GET", headers: { accept: "application/json" } };

    const response = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${req.params.lat}%2C${req.params.lng}&language=en&key=${process.env.TRIPADV_KEY}`,
      options
    );
    const data = await response.json();

    // Extract location IDs
    const locationIds = data.data.map((location) => location.location_id);

    res.status(200).json({ locationIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch nearby locations" });
  }
});

LocationRouter.get("/getDetails/:locationID", async (req, res) => {
  try {
    const options = { method: "GET", headers: { accept: "application/json" } };
    const locationID = req.params.locationID;

    // Check if location already exists in the database
    const existingLocation = await Location.findOne({ locationID });
    if (existingLocation) {
      return res.status(200).json(existingLocation);
    }

    // Fetch Location Details
    const locationDetailsResponse = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/${locationID}/details?language=en&currency=USD&key=${process.env.TRIPADV_KEY}`,
      options
    );
    const locationDetails = await locationDetailsResponse.json();

    // Fetch Location Photos
    const locationPhotosResponse = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/${locationID}/photos?language=en&key=${process.env.TRIPADV_KEY}`,
      options
    );
    const locationPhotosData = await locationPhotosResponse.json();
    const photos = locationPhotosData.data.map(
      (photo) => photo.images.original.url
    );

    // Fetch Location Reviews
    const locationReviewsResponse = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/${locationID}/reviews?language=en&key=${process.env.TRIPADV_KEY}`,
      options
    );
    const locationReviewsData = await locationReviewsResponse.json();
    const reviews = locationReviewsData.data;

    // Create new Location document
    const location = new Location({
      locationID,
      locationDetails,
      photos,
      reviews,
    });

    // Save to database
    await location.save();

    // Send response
    res.status(200).json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch location details" });
  }
});

module.exports = LocationRouter;
