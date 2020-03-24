import * as amqp from 'amqplib'
import { v4 as uuid} from 'uuid';

interface IMessage {
    payload: string
}

export default class Consumer {
    channel : amqp.Channel;
    queue : string;
    messages : IMessage[] = [];

    /**
     * [uuid: string, subject: string, callback: Function]
     */
    subscribers : [string, string, Function][] = [];

    async connect (connection: amqp.Connection) {
        let queue : string = 'users';
        let messages : amqp.ConsumeMessage[] = [];
        let subs = this.subscribers;

        return connection.createChannel()
            .then(async ch => {
                this.channel = ch;
                await ch.assertQueue(queue);

                await ch.consume(queue, function (msg) {
                    try {
                        const content = JSON.parse(String(msg.content));
    
                        if(msg.properties.headers.source !== 'users_service'){
                            console.log('[%s] - New incoming message from: %s', msg.properties.timestamp, msg.properties.headers.source)
                            subs.forEach(sub => {
                                if(sub[1] === content.headers?.subject)
                                    sub[2](content, msg.properties.correlationId);
                            });
                            messages.push(content);
                            ch.ack(msg);
                        }
                    } catch(e) {
                        console.log(e)
                    }
                    

                });
            })
            .catch(e => { throw new Error(e) })
    }

    subscribe(subject: string, callback : (message : IMessage, correlationId : string) => void) : string  {
        const id = uuid();
        this.subscribers.push([id, subject, callback]);
        return id;
    }

    unsubscribe(id : string) : boolean {
        try{
            this.subscribers = this.subscribers.filter(sub => sub[0] !== id);
            return true;
        } catch(e) {
            return false
        }
    }

    getMessages(count : number = 1) : IMessage | IMessage[] {
        let messages : IMessage[] = [];

        if(count === 1){
            messages.push(this.messages.shift())
        } else {
            for(let i = 0; i < count; i++){
                messages.push(this.messages.shift());
            }
        }

        return (messages.length === 1 ? messages.shift() : messages);
    }
}