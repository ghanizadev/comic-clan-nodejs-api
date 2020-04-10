import express from 'express';
import EventHandler from '../events';
declare global {
    namespace Express {
        interface Request {
            eventHandler: EventHandler;
        }
    }
}
declare const _default: {
    errorHandler(err: any, req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: express.Response<any>, next: express.NextFunction): express.Response<any>;
    authHandler(req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: express.Response<any>, next: express.NextFunction): Promise<void>;
};
export default _default;
