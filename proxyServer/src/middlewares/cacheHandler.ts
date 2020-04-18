import redis from 'redis';
import { logger } from '../utils/logger';
import {Request, Response, NextFunction}  from 'express';

interface Options {
    expire : number | undefined;
    name : string | undefined;
}

const retry_strategy = (options : any) : number | Error => {
    if (options.attempt > 30) {
        logger.warn('Cache deactivated due to connectivity issues');
    }

    if (options.error && options.error.code === "ECONNREFUSED") {
        return 1000;
    }
    return 1000;
}

export default (options : Options) => {
    const {expire, name} = options;

    return (req : Request, res : Response, next : NextFunction) => {
        res.end();
    }
}