import express from 'express';
export declare class HTTPError extends Error {
    error: string;
    error_description: string;
    status: number;
    private level;
    constructor(error: string, error_description?: string, status?: number);
}
declare const _default: (err: any, req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response<any>, next: express.NextFunction) => express.Response<any>;
export default _default;
