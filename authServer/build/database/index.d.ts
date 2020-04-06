import redis from 'redis';
export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    replyTo?: string;
}
declare const _default: {
    connect(connectionString: string, databaseName: string): redis.RedisClient;
};
export default _default;
