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

export type Event ='newuser' | 'resetpassword' | 'newmessage'

export default class EventHandler {
    private consumer : redis.RedisClient;
    private channel : string;
    private eventListeners : [string, (message : Message) => void][] = [];


    private retry_strategy(options : any) : number | Error {
        if (options.attempt > 30) {
            console.log('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            console.log('Connection refused, trying again...[%s]', options.attempt)
            return 1000;
        }
        return 1000;
    }

    constructor(connectionString : string, channel : string) {
        const {retry_strategy} = this;

        console.log('Connecting to Redis server...');
        this.channel = channel;
        this.consumer = redis.createClient({retry_strategy, url: connectionString});
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
                    event[1](decoded);

                }
            })
        })
    }

    public on(event : Event, callback : (message : Message) => void) {
        this.eventListeners.push([event, callback]);
    }
}
