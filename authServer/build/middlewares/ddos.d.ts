import { Request, Response, NextFunction } from 'express';
import { RedisClient } from 'redis';
declare const middleware: (db: RedisClient) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction) => void;
export default middleware;
