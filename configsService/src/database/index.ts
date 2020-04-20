import redis, { RedisClient } from 'redis';
import {logger} from '../utils/logger';

export interface Message {
    id ?: string;
    event : string;
    from ?: string;
    body : any;
    replyTo ?: string;
}

export default class Database {
    private static instance : Database;
    public database !: RedisClient;

    private constructor() {}

    public static getInstance(){
        if(!Database.instance) Database.instance = new Database();

        return Database.instance;
    }

    private retry_strategy(options : any) : number | Error {
        if (options.attempt > 30) {
            logger.info('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            return 1000;
        }
        return 1000;
    }

    private setDb (db : RedisClient){
        this.database = db;
    }

    public async connect(connectionString : string, databaseName : string) : Promise<RedisClient>{
        return new Promise((res : (database : RedisClient) => void, rej : any) => {
            const {retry_strategy} = this;

            const r = redis.createClient({url: connectionString, retry_strategy});
    
            r.once('error', rej);
    
            r.once('connect', () => {
                logger.info('Redis connected!');
                res(r);
            })

        })
    }
}