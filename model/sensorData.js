var mongoose = require("mongoose");

var schema = new mongoose.Schema(
  {
    towerId: {
      type: String,
      required: true,
    },
    towerLocation: {
      lat: {type: String},
      long: {type: String}
    },
    towerTemprature: {
      type: Number,
      default: 0,
      required: true,
    },
    powerSource: {
      type: String,
      default: "Electric",
      required: true,
    },
    fuelStatus: {
      type: Number,
      default: 0,
      required: true,
    },
    trackPowerSource: {
      type: Number,
      default: 0,
      required: false,
    }
  },
  { timestamps: true }
);
var sensorData = new mongoose.model("SensorData", schema);
module.exports = sensorData;
