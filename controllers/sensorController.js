const SensorData = require("../model/sensorData");

const ANAMOLIES = {
  maxTemprature: 45,
  minTemprature: 10,
  fuelStatus: 20,
};

const createSensorRecord = async (req, res) => {
  const { towerLocation, towerTemprature, powerSource, fuelStatus } = req.body;
  if (!towerLocation && !towerTemprature && !powerSource && !fuelStatus) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const sensorData = new SensorData({
    towerLocation: towerLocation,
    towerTemprature: towerTemprature,
    powerSource: powerSource,
    fuelStatus: fuelStatus,
  });

  await sensorData
    .save()
    .then((data) => {
      res.send({
        message: "Sensor data posted successfully",
        user: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating record",
      });
    });
};

const getLatestSensorData = async (req, res) => {
  let val = await SensorData.aggregate([
    {
      $group: {
        _id: "$towerId",
        items: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { createdAt: 1 },
    },
  ]);

  let twoHoursBack = new Date();
  twoHoursBack.setHours(twoHoursBack.getHours() - 2);

  const generatorAnamolies = [];

  val.forEach((towerItems) => {
    let isRunningOnGenerator = true;
    towerItems.items.forEach((dataPoint) => {
      const currentItemDate = new Date(dataPoint.createdAt);
      if (currentItemDate >= twoHoursBack && dataPoint.powerSource !== "DG") {
        isRunningOnGenerator = false;
      }
    });
    if (isRunningOnGenerator) {
      generatorAnamolies.push({...towerItems.items.at(-1), type: "Generator"});
    }
  });

  const data = val.map((towerItems) => {
    const item = towerItems.items.at(-1);
    if (
      item.towerTemprature < ANAMOLIES.minTemprature ||
      item.towerTemprature > ANAMOLIES.maxTemprature
    ) {
      item["type"] = "Temprature";
    }
    else if (item.fuelStatus < ANAMOLIES.fuelStatus) {
      item["type"] = "Low Fuel";
    }
    return item;
  });
  const anamolies = filterAnamolies(data);

  return res.send([...anamolies, ...generatorAnamolies]);
};


const getTowerAnalytics = async (req, res) => {
  const towerId = req.params?.id;
  if (!towerId) {
    return res.status(400);
  }
  const data = await SensorData.find({ towerId: towerId });

  // console.log(data);

  return res.send({data});
}

const filterAnamolies = (data) => {
  return data.filter(
    (item) =>
      item.towerTemprature < ANAMOLIES.minTemprature ||
      item.towerTemprature > ANAMOLIES.maxTemprature ||
      item.fuelStatus < ANAMOLIES.fuelStatus
  );
};

module.exports = {
  createSensorRecord,
  getLatestSensorData,
  getTowerAnalytics,
};
