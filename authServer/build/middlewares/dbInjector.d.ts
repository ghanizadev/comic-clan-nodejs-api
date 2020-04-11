import { RedisClient } from 'redis';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            database: RedisClient;
        }
    }
}
declare const _default: (database: RedisClient) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction) => void;
export default _default;
