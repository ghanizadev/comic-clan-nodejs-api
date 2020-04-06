import redis, { RedisClient } from 'redis';

export interface Message {
    id ?: string;
    event : string;
    from ?: string;
    body : any;
    replyTo ?: string;
}

export default {
    connect(connectionString : string, databaseName : string) : RedisClient{

        function retry_strategy(options : any) : number | Error {
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

        return redis.createClient({url: connectionString, retry_strategy});

    }
    
}