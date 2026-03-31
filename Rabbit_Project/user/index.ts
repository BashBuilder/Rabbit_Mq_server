import express from "express";
import {
  closeRabbitMqConnection,
  connectToRabbitMQ,
  publishToQueue,
} from "./config/rabbitmq.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, userId } = req.body;
    const dataRes = await publishToQueue("user_created", {
      name,
      email,
      userId,
    });

    res.status(201).json({ name, email, userId, dataRes });
  } catch (error) {
    console.log("Error publishing to queue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const startServer = async () => {
  try {
    await connectToRabbitMQ();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await closeRabbitMqConnection();
    process.exit(1);
  }
};

startServer();
