const amqp = require("amqplib");

let channel, connection;

async function start(reties = 5, delay = 3000) {
    try {
        connection = await amqp.connect("amqp://rabbitmq");
        channel = await connection.createChannel();
        await channel.assertQueue("task_created");
        console.log(
            "Notification service is listening to messages from RabbitMQ"
        );

        channel.consume("task_created", (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                const task = JSON.parse(messageContent);
                console.log(
                    `Received notification for new task: ${task.title} assigned to user ID: ${task.userId}`
                );
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error("Failed to connect to RabbitMQ, retrying...", err);
    }
}

start();
