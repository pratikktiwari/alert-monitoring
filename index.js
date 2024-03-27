const express = require('express');
const bodyParser = require("body-parser");
const router = require("./routes/sensor");
const cors = require("cors");
const {initConsumer} = require("./rmq/consumer");
const { initRMQListener } = require("./rmq/producer");
require("dotenv").config();

require("./database/main");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", router);
app.use(cors());
app.options("*", cors());

initConsumer();
let rmqChannel;

app.listen(3001, async ()=> {
  rmqChannel = await initRMQListener();
  console.log("Listening on port 3001");
});

app.get('/', (req, res) => {
  res.send({ message: "Hello World!" });
})

app.post("/message", async (req, res) => {
  const { towerId, towerLocation, towerTemprature, powerSource, fuelStatus } = req.body;
  if (
    !towerLocation &&
    !towerTemprature &&
    !powerSource &&
    !fuelStatus &&
    !towerId
  ) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const message = JSON.stringify(req.body);

    // Publish the message to RabbitMQ
    const data = await rmqChannel.publish("direct_exchange", "chat", Buffer.from(message));
    console.log(data)
    return res.status(200).json({message: "Alert published to queue"});
  }
  catch(error){
    return res.status(400).json({ message: "Invalid request" });
  }
});


/*
Sample API request to post to Rabbit MQ
 curl -H 'Content-Type: application/json' \
      -d '{ "towerId": 1, "towerLocation": {lat: "12.971599", long: "77.594566"}, "towerTemprature": 20, "powerSource": "DG", "fuelStatus": 10}' \
      -X POST \
      http://localhost:3001/message

GET Request for latest anamoly
curl http://localhost:3000/api/data
*/

