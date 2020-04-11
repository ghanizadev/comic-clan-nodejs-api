import {RedisClient} from 'redis';
import {Request, Response, NextFunction} from 'express'

declare global {
    namespace Express {
        interface Request {
            database : RedisClient;
        }
    }
}

export default (database : RedisClient) => {
    return (req : Request, res : Response, next : NextFunction) => {
        try{
            if(database) req.database = database;
            else throw new Error('database is null or it is not set')
            next()
        } catch(e) {
            next(e)
        }

    }
}