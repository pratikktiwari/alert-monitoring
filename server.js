const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Consume messages from RabbitMQ
  channel.consume(
    "chat_messages",
    (message) => {
      socket.emit("new_message", message.content.toString());
    },
    { noAck: true }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
