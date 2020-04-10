import redis, { RedisClient } from 'redis';
export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    replyTo?: string;
}
export default class Database {
    private static instance;
    private db;
    private constructor();
    static getInstance(): Database;
    private retry_strategy;
    connect(connectionString: string, databaseName: string): Promise<RedisClient>;
    get(): redis.RedisClient;
}
