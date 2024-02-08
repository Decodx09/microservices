const express = require("express");
const amqp = require("amqplib");
const app = express();
const PORT = 8080;

app.use(express.json());

let connection, channel;
let orderData = []; // Store received order data

async function connect() {
  const ampqServer = "amqp://localhost:5672";
  connection = await amqp.connect(ampqServer);
  channel = await connection.createChannel();

  // Declare the "ORDER" queue
  await channel.assertQueue("ORDER");

  console.log("Order queue declared");

  // Consume messages from the "ORDER" queue
  channel.consume("ORDER", (data) => {
    const { products, userEmail } = JSON.parse(data.content);
    orderData.push({
      products,
      userEmail,
    });
  });
}

connect().then(() => {
app.get("/orders", (req, res) => {
res.json(orderData);
});

app.listen(PORT, () => {
console.log(`Order-Service at ${PORT}`);
});
});
