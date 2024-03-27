const amqp = require("amqplib");

const initRMQListener = async () => {
  return new Promise((resolve, reject) => {
    amqp
      .connect("amqp://localhost")
      .then((connection) => connection.createChannel())
      .then((channel) => {
        // Channel is ready for use
        channel.assertExchange("direct_exchange", "direct", { durable: false });
        channel.assertQueue(process.env.QUEUE, { durable: false });
        channel.bindQueue(process.env.QUEUE, "direct_exchange", "chat");

        console.log("RMQ Channel created");
        resolve(channel);
      })
      .catch((error) => {
        console.error("Error connecting to RabbitMQ", error);
        reject(error);
      });
  });
};

module.exports = {
  initRMQListener,
};