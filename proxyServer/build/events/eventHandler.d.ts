import { Request, NextFunction, Response } from 'express';
declare global {
    namespace Express {
        interface Request {
            eventHandler: EventHandler;
        }
    }
}
export interface Message {
    id?: string;
    event: string;
    from?: string;
    body: any;
    user ?: any;
    replyTo?: string;
}
export interface IResponseType {
    from?: string;
    replyTo?: string;
    status: number;
    [key: string]: any;
}
export interface Reply extends IResponseType {
    payload: any;
}
export interface HTTPError extends IResponseType {
    error: string;
    error_description: string;
}
export declare type ResponseType = Reply | HTTPError;
export default class EventHandler {
    private consumer;
    private publisher;
    private channel;
    private isListening;
    private eventListeners;
    private retry_strategy;
    constructor(connectionString: string, channel: string);
    listen(channel?: string): Promise<void>;
    on(event: 'create' | 'modify' | 'delete' | 'list', callback: (message: Message, reply?: (response: ResponseType) => void) => void): void;
    publish(channel: string | undefined, message: Message): Promise<ResponseType>;
}
export declare const injector: (eventHandler: EventHandler) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>, next: NextFunction) => void;
