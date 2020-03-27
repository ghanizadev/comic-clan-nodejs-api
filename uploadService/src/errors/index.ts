import logger from '../utils/logger';
import express from 'express'

interface Error {
    error : string;
    error_description : string | string[];
    status: number,
}

export default (err : Error | any, req : express.Request, res : express.Response, next : express.NextFunction) => {
    if(err.error && err.error_description && err.status){
        const { error, error_description, status} = err;
        logger.warn(`(${status}) ${error.toUpperCase()}: ${error_description}` )

        return res
        .status(status)
        .send({
            error,
            error_description,
            status,
        });
    }

    logger.warn(`(500) INTERNAL_ERROR: A request just failed`)

    return res
    .status(500)
    .send({
        error: 'server_error',
        error_description: "Internal Server Error. See logs for more information"
    });
}