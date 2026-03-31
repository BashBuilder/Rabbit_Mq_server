import RabbitMQClient from "@adelowotan_anthony/rabbit_mq_handler";

const rabbitMQClient = new RabbitMQClient({
  serviceName: "User Service",
  queues: ["user_created"],
});

export const publishToQueue = async (queue: string, message: object) => {
  await rabbitMQClient.publishToQueue(queue, message);
};

export const connectToRabbitMQ = async () => await rabbitMQClient.connect();

export const closeRabbitMqConnection = async () => await rabbitMQClient.close();
