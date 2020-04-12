import {Request, Response, NextFunction } from 'express';
import EventHandler from '../events'

declare global {
    namespace Express {
        interface Request {
            eventHandler : EventHandler;
        }
    }
}

export default (eventHandler : EventHandler) => {
    return (req : Request, res : Response, next : NextFunction) => {
        req.eventHandler = eventHandler
        next();
    }
}