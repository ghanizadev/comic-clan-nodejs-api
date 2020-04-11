import {Request, Response, NextFunction} from 'express';
import {HTTPError} from '../errors';
import { logger } from '../utils/logger';

export default (err : HTTPError | any, req : Request, res : Response, next : NextFunction) => {
    var ip = req.headers['x-forwarded-for'] || req.ip || req.ips || req.connection.remoteAddress
    if(err.error && err.error_description && err.status){
        const { error, error_description, status} = err;
        let level;

        if(status < 300) level = 'info';
        else if(status < 500) level = 'warn';
        else level = 'error'

        logger.log(level,`(${status}) ERROR: "${error}", ERROR_DESCRIPTION: "${error_description}, IP: ${ip}"`);

        return res
        .status(status)
        .send({
            error,
            error_description,
            status,
        });
    } else {
        logger.log('error', err.message);
        return res
        .status(500)
        .send({
            error: 'internal_error',
            error_description: err.message,
            status: 500,
        });
    }
}