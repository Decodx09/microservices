const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); 
const isAuthenticated = require("../isAuthenticated");
const Product = require('./Product');
const amqp = require("amqplib");
const app = express();
const PORT = 6060;

var channel , connection;

app.use(express.json());
mongoose.connect("mongodb+srv://sukhijashivansh:shivanshsukhija@cluster0.qow0umq.mongodb.net/books-collection?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Product-Service DB-Connected");
})
.catch((error) => {
    console.error("Error connecting to the database:", error);
});

const secretKey = "defaultSecretKey";

async function connect(){
    const ampqServer = "amqp://localhost:5672";
    connection = await amqp.connect(ampqServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
}

connect();

app.post("/product/create" , async (req , res) => {
    const {name , description , price} = req.body;
    const newProduct = new Product({
        name,
        description,
        price
    });
    newProduct.save();
    return res.json(newProduct);
});

app.post("/product/buy" , async (req, res) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });
    const messageObject = {
        products,
        // userEmail: req.user.email,
    };
    const messageBuffer = Buffer.from(JSON.stringify(messageObject));
    channel.sendToQueue("ORDER", messageBuffer);
    res.send("Order placed successfully");
});


app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});
