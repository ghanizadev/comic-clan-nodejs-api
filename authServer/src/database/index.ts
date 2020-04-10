import redis, { RedisClient } from 'redis';

export interface Message {
    id ?: string;
    event : string;
    from ?: string;
    body : any;
    replyTo ?: string;
}

export default class Database {
    private static instance : Database;
    private db !: RedisClient;

    private constructor() {}

    public static getInstance(){
        if(!Database.instance) Database.instance = new Database();

        return Database.instance;
    }

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

    connect(connectionString : string, databaseName : string) : Promise<RedisClient>{
        return new Promise((res, rej) => {
            const {retry_strategy} = this;
    
            let r =redis.createClient({url: connectionString, retry_strategy});
            this.db = r;
    
            r.once('connect', () => {
                res(r);
            })

            r.once('error', () => rej());
        })

    }

    public get() {
        return this.db;
    }
}