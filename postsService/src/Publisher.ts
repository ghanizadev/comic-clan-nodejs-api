import * as amqp from 'amqplib'
import { v4 as uuid} from 'uuid';

export default class Publisher {
    channel : amqp.Channel;
    connection: amqp.Connection;

    async connect (connection: amqp.Connection) {
        this.connection = connection;

        return connection.createChannel()
            .then(ch => {
                this.channel = ch;
                console.log("Successfully connected!");
            })
            .catch(e => { throw new Error(e) })

    }

    async send(queue: string, subject: string, payload : string) {
        const { channel } = this;
        const correlationId = uuid();
        const body = {
            payload,
        }

        const message = Buffer.from(JSON.stringify(body))

        await channel.assertQueue(queue);

        channel.sendToQueue(
            queue,
            message,
            {
                headers: {
                    source: 'posts_service',
                    subject
                },
                correlationId,
                timestamp: Date.now()
            }
        );
    }

    async reply(queue: string, payload : string, correlationId: string, subject?: string, replyTo?: string) {
        const {channel} = this;
        const body = {
            payload,
        }

        const message = Buffer.from(JSON.stringify(body));

        await channel.assertQueue(queue);

        channel.sendToQueue(
            queue,
            message,
            {
                headers: {
                    source: 'posts_service',
                    subject
                },
                correlationId,
                replyTo,
                timestamp: Date.now()
            });
    }
}