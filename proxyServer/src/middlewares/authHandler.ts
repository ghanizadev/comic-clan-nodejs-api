import {Request, Response, NextFunction} from 'express';
import HTTPError from '../errors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import EventHandler, { eventHandler } from '../events';

declare global {
    namespace Express {
        interface Request {
            eventHandler : EventHandler;
            user: any;
        }
    }
}

const accessKeyPub = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'public-access.pem'))

export default (req : Request, res : Response, next : NextFunction) => {
    // if(process.env.NODE_ENV !== 'production') return next();
    try {
        if(!req.headers.authorization?.startsWith("Bearer ")){
            throw new HTTPError('invalid_request', 'Missing Authentication header. A token of type "Bearer" must be provided', 400)
        }

        const token = req.headers.authorization.split(' ')[1];

        const payload : any = jwt.verify(token, accessKeyPub, {algorithms: ['RS256', 'RS512']});

        eventHandler.publish('users_ch', {event: 'list', body: {query: {email: payload.username} }})
        .then(({ payload }) => {

            if(Array.isArray(payload) && payload.length === 0)
                throw new HTTPError('unauthorized_client', 'User was not found or it was deleted')
            req.user = payload[0];
            next();
        })
        .catch(next)

    }catch(e){
        if(['invalid token', 'invalid signature', 'jwt malformed'].includes(e.message)){
            next({error: 'invalid_request', error_description: 'The provided token is invalid or it is in an unsuported format', status: 401});
        } else if (e.message === 'jwt expired'){
            next({error: 'invalid_request', error_description: 'The provided token is expired, please require a new one', status: 401});
        }
        next(e);
    }

}