const SensorData = require("../model/sensorData");

const publishMessage = async (data) => {
  const { towerLocation, towerTemprature, powerSource, fuelStatus, towerId } =
    data;
  if (!towerLocation && !towerTemprature && !powerSource && !fuelStatus) {
    return ({ message: "Content can not be empty!" });
  }

  await SensorData.create(data)
};


module.exports = {
  publishMessage,
};
