const amqp = require("amqplib");
const {publishMessage} = require("../service/sensorService")

const initConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(process.env.QUEUE, { durable: false });
    await channel.consume(
      process.env.QUEUE,
      (message) => {
        if (message) {
          const data = JSON.parse(message.content.toString());
          console.log("Received '%s'", data);
          publishMessage(data);
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
};

module.exports = {
  initConsumer,
};
