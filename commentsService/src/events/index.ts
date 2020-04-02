import * as redis from 'redis';
import * as uuid from 'uuid';


export interface Message {
    id ?: string;
    event : string;
    from ?: string;
    body : any;
    replyTo ?: string;
}

interface IResponseType {
    from ?: string;
    replyTo ?: string;
    status : number;
}

export interface Reply extends IResponseType {
    payload : object;
};

export interface HTTPError extends IResponseType {
    error : string;
    error_description : string;
}

export type ResponseType = Reply | HTTPError;

export default class EventHandler {
    private consumer : redis.RedisClient;
    private publisher : redis.RedisClient;
    private channel : string;
    private isListening : boolean = false;

    private eventListeners : [string, (message : Message, reply : (response : ResponseType) => void) => void, Reply][] = [];

    constructor(connectionString : string, channel ?: string) {
        this.channel = channel;
        this.consumer = redis.createClient(connectionString);
        this.publisher = redis.createClient(connectionString);
    }

    public async listen(channel ?: string){
        if(channel) this.channel = channel;
        this.consumer.subscribe(this.channel);
        console.log('Listening to channel "%s"', this.channel)

        this.consumer.on('message', (ch, msg) => {
            const decoded = JSON.parse(msg);
            console.log('Message received from "%s"', decoded.from)

            this.eventListeners.forEach(event => {
                if(decoded.event === event[0]){
                    event[2] = decoded;
                    
                    event[1](decoded, (response : ResponseType) => {
                        response.replyTo = decoded.id;
                        response.from = this.channel;

                        this.publisher.publish(
                            decoded.from,
                            JSON.stringify(response)
                        )
                        console.log("Replying... [%s]", decoded.from);
                    });

                }
            })
        })
    }

    public on(event : 'create' | 'modify' | 'delete' | 'list', callback : (message : Message, reply ?: (response : ResponseType) => void) => void) {
        this.eventListeners.push([event, callback, null]);
    }

    public async publish(channel : string = this.channel, message : Message) : Promise<ResponseType> {
        if(!this.isListening) await this.listen();

        const _message = message;
        const id = uuid.v4();

        console.log('Publishing with ID "%s" to channel "%s"', id, channel)

        _message.id = id;
        _message.from = this.channel;

        return new Promise((res, rej) => {
            try{
                const listener = (_, msg) => {
                    const message = JSON.parse(msg);
                    if(message.replyTo === id){
                        this.consumer.removeListener('message', listener);
                        res(message as ResponseType);
                    }
                }
                this.consumer.addListener('message', listener);

                this.publisher.publish(channel, JSON.stringify(_message));
            } catch(e){
                console.log(e);
                rej(e);
            }
        })
    }
}
