import { Request, Response, NextFunction } from 'express';
declare const rateLimiterMiddleware: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>, next: NextFunction) => void;
export default rateLimiterMiddleware;
