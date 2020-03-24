import * as amqp from 'amqplib'
import { v4 as uuid} from 'uuid';

export default class Publisher {
    channel : amqp.Channel;
    queue : string = 'users';
    replyQueue : string = 'users_reply';
    connection: amqp.Connection;

    async connect (connection: amqp.Connection) {
        this.connection = connection;
        let channel : amqp.Channel;

        return connection.createChannel()
            .then(ch => {
                channel = ch;
                return ch.assertQueue('posts');
            })
            .then(q => {
                this.queue = q.queue
                this.channel = channel;

                console.log("Successfully connected!");

            })
            .catch(e => { throw new Error(e) })

    }

    async send(subject: string, payload : string, queue: string) {
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

        const sent = channel.sendToQueue(
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

        return sent;
    }
}