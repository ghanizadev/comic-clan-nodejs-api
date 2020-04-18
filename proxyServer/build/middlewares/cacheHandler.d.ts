import { Request, Response, NextFunction } from 'express';
interface Options {
    expire: number | undefined;
    name: string | undefined;
}
declare const _default: (options: Options) => (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("express-serve-static-core").Query>, res: Response<any>, next: NextFunction) => void;
export default _default;
