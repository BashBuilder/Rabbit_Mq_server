import express from "express";
import helmet from "helmet";
import cors from "cors";
import { closeRabbitMQConnection, connectToRabbitMQ, consumeFromQueue, } from "./config/rabbitmq.js";
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4001;
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", app: "Todo Service" });
});
// app.post("/todos", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const display =
//     res.status(201).json({ title, description, display });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
const startServer = async () => {
    try {
        await connectToRabbitMQ();
        await consumeFromQueue();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        await closeRabbitMQConnection();
        console.error("Error starting server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map