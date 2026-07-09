const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const amqp = require("amqplib");

const app = express();
const port = 3002;

app.use(bodyParser.json());

mongoose
    // .connect("mongodb://localhost:27017/users")
    .connect("mongodb://mongo:27017/tasks") // Updated for Docker Compose
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema);

let channel, connection;

async function connectRabbitMQWithRetry(reties = 5, delay = 3000) {
    while (reties) {
        try {
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_created", { durable: true });
            console.log("Connected to RabbitMQ");
            return;
        } catch (err) {
            console.error("Failed to connect to RabbitMQ, retrying...", err);
            reties--;
            if (!reties) {
                console.error("Exhausted all retries to connect to RabbitMQ");
                break;
            }
            await new Promise((res) => setTimeout(res, delay));
        }
    }
}

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const task = new Task({ title, description, userId });
        await task.save();

        const message = {
            id: task._id,
            title,
            description,
            userId,
        };

        channel.sendToQueue(
            "task_created",
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        res.status(201).json(task);
    } catch (err) {
        console.log("Error Saving:", err);
        res.status(500).json({ error: "Failed to create task" });
    }
});

app.delete("/tasks/all", async (req, res) => {
    try {
        await Task.deleteMany({});
        res.status(200).json({ message: "All tasks deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete tasks" });
    }
});

app.listen(port, () => {
    console.log(`Task service listening at http://localhost:${port}`);
    connectRabbitMQWithRetry();
});

module.exports = app;
