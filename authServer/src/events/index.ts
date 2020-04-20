import * as redis from 'redis';
import * as uuid from 'uuid';
import { logger } from '../utils/logger';
import Message from './Message';
import Reply from './Reply';
import HTTPError from '../errors/HTTPError';

type Event = 'newuser' | 'resetpassword' | 'removeuser' | 'checkcredentials' | 'createadmin';
export default class EventHandler {
    private static instance : EventHandler;
    private consumer !: redis.RedisClient;
    private publisher !: redis.RedisClient;
    private channel !: string;

    private eventListeners : [string, (message : Message, reply : (response : Reply | HTTPError) => void) => void, Reply][] = [];

    private retry_strategy(options : any) : number | Error {
        if (options.attempt > 30) {
            logger.warn('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            return 1000;
        }
        return 1000;
    }

    private constructor() {}

    public static getInstance() {
        if(!EventHandler.instance){
            EventHandler.instance = new this();
        }
        return EventHandler.instance;
    }

    public async connect(connectionString : string, channel : string){
        const {retry_strategy} = this;

        logger.info('Connecting to Redis server...');
        this.channel = channel;
        this.consumer = redis.createClient({retry_strategy, url: connectionString});
        this.publisher = redis.createClient({retry_strategy, url: connectionString});

        this.consumer.once('connect', () => {
            logger.info('Consumer connected!');

            logger.info(`Subscribing to channel "${this.channel}"...`)
            this.consumer.subscribe(this.channel);

            this.consumer.on('subscribe', (ch) => logger.info(`Consumer subscribed to "${ch}"`));

            this.consumer.on('message', (ch, msg) => {
                const decoded = JSON.parse(msg);

                logger.info(`Message received from "${decoded.from}"`)

                this.eventListeners.forEach(event => {
                    if(decoded.event === event[0]){

                        event[2] = decoded;

                        event[1](decoded, (response : Reply | HTTPError) => {
                            response.replyTo = decoded.id;
                            response.from = this.channel;

                            this.publisher.publish(
                                decoded.from,
                                JSON.stringify(response)
                                )
                                logger.info(`Replying... [${decoded.from}]`);
                        });

                    }
                })
            })

        });
        this.publisher.once('connect', () => {
            logger.info('Publisher connected!');
        });
    }

    public on(event : Event, callback : (message : Message, reply : (response : Reply | HTTPError) => void) => void) {
        this.eventListeners.push([event, callback, {payload: {}, status: 500}]);
    }

    public async publish(channel : string = this.channel, message : Message) : Promise<Reply> {
        return new Promise((res : (value : Reply) => void, rej : (error : HTTPError) => void) => {
            try{
                const _message = message;
                const id = uuid.v4();

                logger.info(`Publishing with id=${id} to channel=${channel}`)

                _message.id = id;
                _message.from = this.channel;

                const listener = (_: any, msg: string) => {
                    const message = JSON.parse(msg);
                    if(message.replyTo === id){
                        this.consumer.removeListener('message', listener);
                        res(message as Reply);
                    }
                }
                this.consumer.addListener('message', listener);

                this.publisher.publish(channel, JSON.stringify(_message));
            } catch(e){
                logger.error(e);
                rej(e as HTTPError);
            }
        })
    }
}