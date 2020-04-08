import express, {Request, Response, NextFunction} from 'express';
import { HTTPError } from '../errors';
import jwt from 'jsonwebtoken';
import EventHandler from '../events';

declare global {
    namespace Express {
        interface Request {
            eventHandler : EventHandler;
        }
    }
}

export default {
    errorHandler (err : HTTPError | any, req : express.Request, res : express.Response, next : express.NextFunction) {
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

    async authHandler(req : Request, res : Response, next : NextFunction) {
        return;
    },
}
