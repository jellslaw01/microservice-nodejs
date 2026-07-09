const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());

mongoose
    // .connect("mongodb://localhost:27017/users")
    .connect("mongodb://mongo:27017/users") // Updated for Docker Compose
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model("User", UserSchema);

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.delete("/users/all", async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).json({ message: "All users deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete users" });
    }
});

app.listen(port, () => {
    console.log(`User service listening at http://localhost:${port}`);
});
module.exports = app;
