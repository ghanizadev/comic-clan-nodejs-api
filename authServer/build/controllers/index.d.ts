import { Request, Response, NextFunction } from 'express';
export interface IAuthorize {
    username: string;
    password: string;
    grant_type: 'password' | 'refresh_token';
    scope: string;
}
declare const _default: {
    authorize(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>, next: NextFunction): Promise<void>;
    revoke(): Promise<void>;
};
export default _default;
