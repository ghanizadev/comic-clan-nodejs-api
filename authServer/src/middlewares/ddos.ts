import {RateLimiterRedis} from 'rate-limiter-flexible';
import {Request, Response, NextFunction} from 'express';
import Database from '../database';
import { RedisClient } from 'redis';

const middleware = (db : RedisClient) => {
    const rateLimiter = new RateLimiterRedis({
        storeClient: db,
        keyPrefix: 'middleware',
        points: 10,
        duration: 1,
    });

    return (req : Request, res : Response, next: NextFunction) => {
        rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
    };
}

export default middleware;