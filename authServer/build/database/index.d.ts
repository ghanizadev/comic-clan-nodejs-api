import { RedisClient } from 'redis';
export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    user ?: any;
    replyTo?: string;
}
export default class Database {
    private static instance;
    database: RedisClient;
    private constructor();
    static getInstance(): Database;
    private retry_strategy;
    private setDb;
    connect(connectionString: string, databaseName: string): Promise<RedisClient>;
}
