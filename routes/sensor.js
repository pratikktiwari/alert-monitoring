const express = require("express");
const {
  createSensorRecord,
  getLatestSensorData,
  getTowerAnalytics,
} = require("../controllers/sensorController");

const router = express.Router();
router.post("/data", createSensorRecord);
router.get("/data/:id", getTowerAnalytics);
router.get("/data", getLatestSensorData);

module.exports = router;
