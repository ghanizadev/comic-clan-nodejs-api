import express from 'express';
declare const _default: {
    errorHandler(err: any, req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response<any>, next: express.NextFunction): express.Response<any>;
    authHandler(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response<any>, next: express.NextFunction): Promise<void>;
};
export default _default;
