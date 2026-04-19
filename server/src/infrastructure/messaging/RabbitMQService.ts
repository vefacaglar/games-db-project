import amqplib from 'amqplib';

export class RabbitMQService {
  private connection: amqplib.Connection | null = null;
  private channel: amqplib.Channel | null = null;
  private readonly url: string;

  constructor(url: string = 'amqp://localhost') {
    this.url = url;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqplib.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log('RabbitMQ connected successfully');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publish(queue: string, message: object): Promise<boolean> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      const result = this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
      console.log(`Message published to queue ${queue}:`, message);
      return result;
    } catch (error) {
      console.error('Failed to publish message:', error);
      return false;
    }
  }

  async consume(
    queue: string,
    callback: (msg: object) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel!.ack(msg);
          console.log(`Message processed from queue ${queue}`);
        } catch (error) {
          console.error('Failed to process message:', error);
          // Requeue the message after 5 seconds
          setTimeout(() => {
            this.channel!.nack(msg, false, true);
          }, 5000);
        }
      }
    });
    console.log(`Consumer started for queue ${queue}`);
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

// Singleton instance
export const rabbitMQService = new RabbitMQService(
  process.env.RABBITMQ_URL || 'amqp://localhost'
);