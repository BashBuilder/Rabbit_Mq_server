interface RabbitMQConfig {
    url?: string;
    queues?: string[];
    sericeName?: string;
}
declare class RabbitMQClient {
    private config;
    private connection;
    private channel;
    constructor(config?: RabbitMQConfig);
    connect(): Promise<void>;
    publishToQueue(queue: string, message: object): Promise<boolean>;
    consumeFromQueue(queue: string, handler: (message: any) => Promise<void>, options?: {
        noAck?: boolean;
    }): Promise<false | undefined>;
    close(): Promise<void>;
}
export default RabbitMQClient;
//# sourceMappingURL=index.d.ts.map