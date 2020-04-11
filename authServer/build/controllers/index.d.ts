import { Request, Response, NextFunction } from 'express';
export interface IAuthorize {
    username?: string;
    password?: string;
    refresh_token?: string;
    grant_type: 'password' | 'refresh_token';
    scope?: string;
}
declare const _default: {
    authorize(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction): Promise<void>;
    refresh(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction): Promise<void>;
    revoke(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction): Promise<boolean>;
};
export default _default;
