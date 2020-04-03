import * as redis from 'redis';
import * as uuid from 'uuid';
import { Request, NextFunction, Response } from 'express';
import logger from '../utils/logger';
import ping from 'ping';

declare global {
    namespace Express {
        interface Request {
            eventHandler : EventHandler;
        }
    }
}

export interface Message {
    id ?: string;
    event : string;
    from ?: string;
    body : any;
    replyTo ?: string;
}

export interface IResponseType {
    from ?: string;
    replyTo ?: string;
    status : number;
    [key: string] : any;
}

export interface Reply extends IResponseType {
    payload : any;
};

export interface HTTPError extends IResponseType {
    error : string;
    error_description : string;
}

export type ResponseType = Reply | HTTPError;

export default class EventHandler {
    private consumer!: redis.RedisClient;
    private publisher!: redis.RedisClient;
    private channel : string;
    private isListening : boolean = false;

    private eventListeners : [string, (message : Message, reply : (response : ResponseType) => void) => void, Reply][] = [];

    constructor(connectionString : string, channel : string) {
        this.channel = channel;
        logger.info(`Trying to connect to REDIS... [${connectionString}]`);

        let count = 0;

        const t = setInterval(() => {
            try {
                this.consumer = redis.createClient(connectionString);
                this.publisher = redis.createClient(connectionString);
                console.log('Successfully connected to Redis!');
                clearInterval(t);
                return;
            } catch(e){
                if(count <= 30){
                    console.log("[%d] Pinging...", count)
                    count ++;
                    return;
                } else {
                    clearInterval(t);
                    console.log("Failed to connect to Redis..")
                    process.exit(1);
                }
            }
        }, 1000);

    }

    public async listen(channel ?: string){
        if(channel) this.channel = channel;

        this.consumer.subscribe(this.channel);
        this.isListening = true;
        console.log('Litening to channel', this.channel);

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
                    });
                }
            })
        })
    }

    public on(event : 'create' | 'modify' | 'delete' | 'list', callback : (message : Message, reply ?: (response : ResponseType) => void) => void) {
        this.eventListeners.push([event, callback, {payload: {}, status: 500}]);
    }

    public async publish(channel : string = this.channel, message : Message) : Promise<ResponseType> {
        if(!this.isListening) await this.listen();

        const _message = message;
        const id = uuid.v4();

        _message.id = id;
        _message.from = this.channel;

        console.log('Publishing with ID "%s" to channel "%s"', id, channel)

        return new Promise((res, rej) => {
            try{
                const listener = (_: any, msg: string) => {
                    const mess = JSON.parse(msg);
                    if(mess.replyTo === id){
                        this.consumer.removeListener('message', listener);
                        if(mess.status >= 400)
                            return rej(mess as Reply)
                        return res(mess as Reply);
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

export const injector = (eventHandler : EventHandler) => {
    return (req : Request, res : Response, next : NextFunction) => {
        Object.defineProperty(req, 'eventHandler', {value: eventHandler });

        next();
    }
}