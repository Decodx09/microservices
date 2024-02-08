const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); 
const User = require("./User");
const app = express();
const PORT = 7070;

app.use(express.json());
mongoose.connect("mongodb+srv://sukhijashivansh:shivanshsukhija@cluster0.qow0umq.mongodb.net/books-collection?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Auth-Service DB-Connected");
})
.catch((error) => {
    console.error("Error connecting to the database:", error);
});

const secretKey = "defaultSecretKey";

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User Doesn't Exist" });
        }
        if (password !== user.password) {
            return res.json({ message: "Password is not correct" });
        }
        const payload = {
            email,
            name: user.name
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Set token expiration
        return res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ message: "User Already Exists" });
        }
        const newUser = new User({
            name,
            email,
            password,
        });
        await newUser.save();
        return res.json(newUser);
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
});
