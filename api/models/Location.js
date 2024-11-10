const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  locationId: {
    type: String,
  },
  locationDetails: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
  },
  photos: {
    type: Array,
  },
  reviews: {
    type: Array,
  },
});

module.exports = mongoose.model("Location", LocationSchema);
