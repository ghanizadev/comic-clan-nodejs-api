import redis from 'redis';
import {RateLimiterRedis} from 'rate-limiter-flexible';
import {Request, Response, NextFunction} from 'express';

const redisClient = redis.createClient(process.env.REDIS_HOST || 'redis://localhost:6379/');

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
});

const rateLimiterMiddleware = (req : Request, res : Response, next: NextFunction) => {
    rateLimiter.consume(req.ip)
    .then(() => {
        next();
    })
    .catch(() => {
        res.status(429).send('Too Many Requests');
    });
};

export default rateLimiterMiddleware;