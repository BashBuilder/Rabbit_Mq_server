import RabbitMQClient from "@adelowotan_anthony/rabbit_mq_handler";

const rabbitMQClient = new RabbitMQClient({
  serviceName: "Todo Service",
  queues: ["user_created"],
});

export const connectToRabbitMQ = async () => rabbitMQClient.connect();
export const closeRabbitMQConnection = async () => rabbitMQClient.close();

export const consumeFromQueue = async () => {
  await rabbitMQClient.consumeFromQueue(
    "user_created",
    async (event: any) => {
      console.log("Received user created_event: ", event);
      console.log({
        event,
        userEmail: event.email || "no email",
      });
    },
    {
      noAck: true,
    },
  );
};
