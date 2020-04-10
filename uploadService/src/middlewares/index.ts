import { HTTPError } from "../errors";
import {Request, Response, NextFunction } from 'express';

export default {
    errorHandler (err : HTTPError | any, req : Request, res : Response, next : NextFunction) {
        console.error(err);
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
    },
}