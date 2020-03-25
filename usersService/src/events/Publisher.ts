import * as amqp from 'amqplib'
import { v4 as uuid} from 'uuid';

export default class Publisher {
    channel : amqp.Channel;
    connection: amqp.Connection;
    name : string = 'users_service';

    /**
     * 
     * @param name Set then name used to identify the origin of messages
     * @default 'users_service'
     */
    setName(name : string) {
        this.name = name;
    }

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
        const { channel, name } = this;
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
                    source: name,
                    subject
                },
                correlationId,
                timestamp: Date.now()
            }
        );
    }

    async reply(queue: string, payload : string, correlationId: string, subject?: string, replyTo?: string) {
        const { channel, name } = this;
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
                source: name,
                subject
            },
            correlationId,
            replyTo,
            timestamp: Date.now()
        });
    }
}