import amqp from "amqplib";
class RabbitMQClient {
    config;
    connection;
    channel;
    constructor(config = {}) {
        this.config = config;
    }
    async connect() {
        try {
            const rabbitMQUrl = this.config.url || "amqp://localhost:5672";
            this.connection = await amqp.connect(rabbitMQUrl);
            // ⚡ Add await here
            this.channel = await this.connection.createChannel();
            if (this.config.queues) {
                for (const queue of this.config.queues) {
                    await this.channel.assertQueue(queue, { durable: true });
                }
            }
            const serviceName = this.config.serviceName || "RabbitMQClient"; // also fix typo: serviceName -> serviceName
            console.log(`${serviceName} connected to RabbitMQ at ${rabbitMQUrl}`);
        }
        catch (error) {
            const serviceName = this.config.serviceName || "RabbitMQClient";
            console.error(`${serviceName} failed to connect to RabbitMQ:`, error);
        }
    }
    async publishToQueue(queue, message) {
        try {
            if (!this.channel) {
                console.error("Channel is not established. Please connect to RabbitMQ first.");
                return false;
            }
            const serviceName = this.config.serviceName || "RabbitMQClient";
            await this.channel.assertQueue(queue, { durable: true });
            await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
            console.log(`${serviceName} published message to queue ${queue}:`, message);
            return true;
        }
        catch (error) {
            console.log(`${this.config.serviceName || "RabbitMQClient"} failed to publish message to queue ${queue}:`, error);
            return false;
        }
    }
    async consumeFromQueue(queue, handler, options = {}) {
        if (!this.channel) {
            console.error("Channel is not established. Please connect to RabbitMQ first.");
            return false;
        }
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    await handler(content);
                    if (!options.noAck) {
                        this.channel.ack(msg);
                    }
                    console.log(`${this.config.serviceName || "RabbitMQClient"} consumed message from queue ${queue}:`, content);
                }
                catch (error) {
                    console.error(`${this.config.serviceName || "RabbitMQClient"} failed to consume message from queue ${queue}:`, error);
                }
            }
        });
        try {
        }
        catch (error) {
            console.error(`${this.config.serviceName || "RabbitMQClient"} failed to consume from queue ${queue}:`, error);
        }
    }
    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
        }
        catch (error) {
            console.error(`${this.config.serviceName || "RabbitMQClient"} failed to close connection:`, error);
        }
    }
}
export default RabbitMQClient;
//# sourceMappingURL=index.js.map