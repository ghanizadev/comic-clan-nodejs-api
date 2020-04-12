import {Request, Response, NextFunction} from 'express';
import HTTPError from '../errors';

export default (err : HTTPError | any, req : Request, res : Response, next : NextFunction) => {
    if(err.error && err.error_description && err.status){
        const { error, error_description, status} = err;
        return res
        .status(status)
        .send({
            error,
            error_description,
            status,
        });
    } else {
        return res
        .status(500)
        .send({
            error: 'internal_error',
            error_description: err.message,
            status: 500,
        });
    }
}
