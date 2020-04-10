import redis from 'redis';

export interface Message {
    id ?: string;
    event : string;
    from ?: string;
    body : any;
    replyTo ?: string;
}

type Event = 'newuser' | 'resetpassword' | 'removeuser'

export default class EventHandler {
    private static instance : EventHandler;
    private consumer !: redis.RedisClient;
    private channel !: string;

    private eventListeners : [Event, (message : Message) => void][] = [];

    private retry_strategy(options : any) : number | Error {
        if (options.attempt > 30) {
            console.log('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            return 1000;
        }
        return 1000;
    }

    private constructor() {};

    public static getInstance() {
        if(!EventHandler.instance) EventHandler.instance = new EventHandler();

        return EventHandler.instance;
    }

    public connect(connectionString : string, channel : string){
        const {retry_strategy} = this;

        this.channel = channel;
        this.consumer = redis.createClient({url: connectionString, retry_strategy});

        this.consumer.once("connect", () => {
            console.log("Connected to Redis!")
            this.consumer.subscribe(this.channel);

            this.consumer.on('message', (_, message ) => {
                const msg : Message = JSON.parse(message);
                this.eventListeners.forEach(event => {
                    if(event[0] === msg.event) {
                        event[1](msg);
                    }
                })
            })
        })
        
    }

    public on (event : Event, callback : (message : Message) => void) {
        this.eventListeners.push([event, callback]);
    }
}