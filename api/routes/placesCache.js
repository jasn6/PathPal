const express = require("express");
const PlacesCache = require("../models/PlacesCache.js");

const placesRouter = express.Router();

placesRouter.get("/:lat/:lng/:type", async (req, res) => {
  try {
    var location = await PlacesCache.findOne({
      type: req.params.type,
      lat: req.params.lat,
      lng: req.params.lng,
    });
    if (!location) {
      return res.status(204).json({ message: "Location not cached" });
    }
    res.status(200).json(location.places);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

placesRouter.post("/", async (req, res) => {
  try {
    await PlacesCache.create({
      places: req.body.places,
      type: req.body.type,
      lat: req.body.lat,
      lng: req.body.lng,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error" });
  }
});

placesRouter.get("/location-details", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.content.tripadvisor.com/api/v1/location/8532722/details?key=BFB4EDF95F5B489399486EDDE1E3EAEA&language=en&currency=USD"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

placesRouter.get("/photos", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.content.tripadvisor.com/api/v1/location/8532722/photos?key=BFB4EDF95F5B489399486EDDE1E3EAEA&language=en"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = placesRouter;
