import { Request, Response, NextFunction } from 'express';
import EventHandler from '../events';
declare global {
    namespace Express {
        interface Request {
            eventHandler: EventHandler;
            user: any;
        }
    }
}
declare const _default: (scopes: string[]) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction) => void;
export default _default;
